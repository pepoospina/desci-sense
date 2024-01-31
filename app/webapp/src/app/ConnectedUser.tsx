import { Box, Text } from 'grommet';
import { UserExpert } from 'grommet-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppButton, AppCircleDropButton } from '../ui-components';
import { useThemeContext } from '../ui-components/ThemedApp';
import { cap } from '../utils/general';
import { useAccountContext } from './AccountContext';

export const ConnectedUser = (props: {}) => {
  const { t } = useTranslation();
  const { isConnected, connect, disconnect, connectedUser } =
    useAccountContext();
  const { constants } = useThemeContext();

  const [showDrop, setShowDrop] = useState<boolean>(false);

  const content = (() => {
    if (!isConnected) {
      return (
        <AppButton
          style={{ fontSize: '16px', padding: '6px 8px' }}
          label={t('connect')}
          onClick={() => connect()}></AppButton>
      );
    }

    return (
      <AppCircleDropButton
        plain
        label={
          <Box>
            <UserExpert
              color={constants.colors.primary}
              style={{ margin: '2px 0px 0px 5px' }}></UserExpert>
            <Text>{connectedUser?.name}</Text>
          </Box>
        }
        open={showDrop}
        onClose={() => setShowDrop(false)}
        onOpen={() => setShowDrop(true)}
        dropContent={
          <Box pad="20px" gap="small">
            <Box margin={{ bottom: 'small' }}>
              <Text>{cap(t('connectedAs'))}</Text>
            </Box>

            <AppButton
              plain
              onClick={() => disconnect()}
              style={{ textTransform: 'none', paddingTop: '6px' }}>
              <Text style={{ fontWeight: 'bold' }}>{cap(t('logout'))}</Text>
            </AppButton>
          </Box>
        }
        dropProps={{ style: { marginTop: '60px' } }}></AppCircleDropButton>
    );
  })();

  return (
    <Box
      style={{ width: '84px', height: '60px' }}
      align="center"
      justify="center">
      {content}
    </Box>
  );
};
