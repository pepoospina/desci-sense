import { Box } from 'grommet';
import { useMemo } from 'react';

import { ParserResult } from '../shared/types';
import { LoadingDiv } from '../ui-components/LoadingDiv';
import { renderPatterns } from './patterns/patterns';

const DEBUG = false;

export const SemanticsEditor = (props: {
  isLoading: boolean;
  parsed?: ParserResult;
}) => {
  const patterns = useMemo<JSX.Element[]>(() => {
    if (DEBUG) console.log('patterns', { parsed: props.parsed });
    if (!props.parsed || !props.parsed.semantics) {
      return [];
    }
    return renderPatterns(props.parsed);
  }, [props.parsed]);

  if (props.isLoading || !props.parsed) {
    return <LoadingDiv></LoadingDiv>;
  }

  return <Box style={{ width: '100%' }}>{patterns}</Box>;
};
