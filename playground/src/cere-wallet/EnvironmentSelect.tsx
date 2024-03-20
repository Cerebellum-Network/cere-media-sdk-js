import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

type WalletEnvironment = 'local' | 'dev' | 'stage' | 'prod';

interface WalletEnvironmentPopupProps {
  onSelect: (env: WalletEnvironment) => void;
}

export const WalletEnvironmentPopup: React.FC<WalletEnvironmentPopupProps> = ({ onSelect }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (env: WalletEnvironment) => {
    handleClose();
    onSelect(env);
  };

  return (
    <div>
      <Button onClick={handleClick}>Select Environment</Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {['local', 'dev', 'stage', 'prod'].map((env) => (
          <MenuItem key={env} onClick={() => handleSelect(env as WalletEnvironment)}>
            {env}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
