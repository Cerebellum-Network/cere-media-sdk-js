import { UriSigner, UriSignerOptions } from '@cere-activity-sdk/signers';
import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

export class PublicKeySigner extends UriSigner {
  private _publicKey: `0x${string}`;

  constructor(publicKey: Uint8Array, options: UriSignerOptions = {}) {
    super('', options);
    this._publicKey = u8aToHex(publicKey) as `0x${string}`;
    this.isReady();
  }

  async isReady() {
    const isCryptoReady = await cryptoWaitReady();
    if (!isCryptoReady) {
      return false;
    }

    const keyring = new Keyring({ ss58Format: 54, type: this.type });
    const pair = keyring.addFromAddress(this._publicKey);

    return !!pair;
  }

  get publicKey(): `0x${string}` {
    return this._publicKey;
  }

  get address() {
    const keyring = new Keyring({ ss58Format: 54, type: this.type });
    const pair = keyring.addFromAddress(this._publicKey);
    return pair.address;
  }

  async sign(data: Uint8Array | string) {
    const keyring = new Keyring({ ss58Format: 54, type: this.type });
    const pair = keyring.addFromAddress(this._publicKey);
    const signature = pair.sign(data);
    return u8aToHex(signature);
  }
}
