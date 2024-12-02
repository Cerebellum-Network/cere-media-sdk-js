import { DdcClient, FileUri } from '@cere-ddc-sdk/ddc-client';
import type { LoaderCallbacks, LoaderConfiguration, LoaderContext, LoaderResponse, LoaderStats } from 'hls.js';
import { LoadStats, HlsConfig, Loader } from 'hls.js';

interface EncryptionConfig {
  bucketId: bigint;
  cid: string;
  ddcClient: DdcClient;
}

export const createHlsDdcLoader = (config: EncryptionConfig): { new (confg: HlsConfig): Loader<LoaderContext> } => {
  const { ddcClient, bucketId, cid: manifestCid } = config;
  return class {
    private config: LoaderConfiguration | null = null;
    private callbacks: LoaderCallbacks<LoaderContext> | null = null;
    public context: LoaderContext | null = null;

    public stats: LoaderStats;

    constructor(config: HlsConfig) {
      console.log('CREATE LOADER');
      this.stats = new LoadStats();
    }

    destroy() {
      console.log('DESTROY');
      this.callbacks = null;
      this.abortInternal();
      this.config = null;
      this.context = null;
    }

    abortInternal() {
      //this.stats.aborted = true;
    }

    abort() {
      console.log('ABORT!');
      this.abortInternal();
      if (this.callbacks?.onAbort) {
        this.callbacks.onAbort(this.stats, this.context as LoaderContext, null);
      }
    }

    load(context: LoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>) {
      console.log(
        'LOAD (url: ' +
          context.url +
          'start: ' +
          context.rangeStart +
          ', end: ' +
          context.rangeEnd +
          ', progressData: ' +
          context.progressData +
          ')',
      );
      console.log(context.headers);
      if (this.stats.loading.start) {
        throw new Error('Loader can only be used once.');
      }
      this.stats.loading.start = self.performance.now();
      this.context = context;
      this.config = config;
      this.callbacks = callbacks;
      console.log('before load internal');
      this.loadInternal();
    }

    loadInternal() {
      const { config, context, callbacks } = this;
      if (!config || !context) {
        console.log('nothing');
        return;
      }
      const stats = this.stats;
      stats.loading.first = 0;
      stats.loaded = 0;
      stats.aborted = false;

      console.log('before DDC call');
      let cid = '';
      let isManifest = false;
      if (context.url == manifestCid) {
        cid = manifestCid;
        isManifest = true;
      } else {
        cid = context.url.split('/')[1];
        isManifest = false;
      }
      try {
        console.log('going to fetch CID: ' + cid);
        ddcClient
          .read(new FileUri(bucketId, cid))
          .then((fileResponse) => {
            console.log('got DDC response');
            return fileResponse.arrayBuffer();
          })
          .then((data) => {
            if (!callbacks) {
              console.log('CALLBACKS ARE EMPTY');
              return;
            }
            const onProgress = callbacks.onProgress;
            if (onProgress) {
              onProgress(stats, context, data, ddcClient);
            }
            stats.loaded = stats.total = data.byteLength;
            const response: LoaderResponse = {
              url: context.url,
              data: data,
            };
            if (isManifest) {
              response.data = Buffer.from(data).toString('utf-8');
            }
            callbacks.onSuccess(response, stats, context, ddcClient);
          })
          .catch((error) => {
            console.log('ERROR ' + error);
            this.callbacks!.onError({ code: 500, text: error.toString() }, context, ddcClient, stats);
          });
      } catch (e) {
        console.log('DDC failed: ' + e);
      }
      console.log('after DDC call');
    }

    getCacheAge(): number | null {
      console.log('Get cache age');
      return null;
    }

    getResponseHeader(name: string): string | null {
      console.log('Get response header: ' + name);
      return null;
    }
  };
};
