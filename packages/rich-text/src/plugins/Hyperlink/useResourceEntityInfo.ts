import * as React from 'react';

import { Entry, useResource } from '@contentful/field-editor-reference';

import { truncateTitle } from '../../plugins/shared/utils';
import { ResourceLink } from '../../rich-text-types/src';


type ResourceEntityInfoProps = {
  target: ResourceLink;
  onEntityFetchComplete?: VoidFunction;
};

export function useResourceEntityInfo({ onEntityFetchComplete, target }: ResourceEntityInfoProps) {
  const { data, error, status } = useResource<Entry>(target.sys.linkType, target.sys.urn);

  React.useEffect(() => {
    if (status === 'success') {
      onEntityFetchComplete?.();
    }
  }, [status, onEntityFetchComplete]);

  if (status === 'loading') {
    return `Loading entry...`;
  }

  if (!data || error) {
    return `Content missing or inaccessible`;
  }

  const title =
    truncateTitle(
      data.resource.fields[data.contentType.displayField]?.[data.defaultLocaleCode],
      40
    ) || 'Untitled';

  return `${data.contentType.name}: ${title} (Space: ${data.space.name} – Env.: ${data.resource.sys.environment.sys.id})`;
}
