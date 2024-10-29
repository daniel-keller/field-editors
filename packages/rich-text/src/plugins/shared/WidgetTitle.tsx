import * as React from 'react';

import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';
import { Badge } from '@contentful/f36-components';

const styles = {
  title: css({
    marginBottom: tokens.spacing2Xs,
    marginTop: tokens.spacing2Xs,
    marginRight: tokens.spacing2Xs,
  }),
};

interface Props {
  title: string
}

export function WidgetTitle(props: Props) {
    return (
        <div contentEditable={false}>
            <Badge variant="primary" className={styles.title}>
                {props.title}
            </Badge>
        </div>
    );
}
