import React, { useEffect, useMemo } from 'react';
import { RoutesLayer } from './RoutesLayer';
import {
  ClimbingContextProvider,
  useClimbingContext,
} from '../contexts/ClimbingContext';
import type { Feature } from '../../../../services/types';
import type { ClimbingRoute } from '../types';

const EMPTY_FEATURE: Feature = {
  type: 'Feature',
  osmMeta: { type: 'relation', id: 0 },
  tags: {},
  properties: { class: '', subclass: '' },
  center: [0, 0],
};

export type RoutesLayerPureProps = {
  routes: ClimbingRoute[];
  photoPath: string;
  imageSize?: { width: number; height: number };
};

type SetupProps = Required<RoutesLayerPureProps>;

const Setup = ({ routes, photoPath, imageSize }: SetupProps) => {
  const { setRoutes, setPhotoPath, setImageSize, setAreRoutesLoading } =
    useClimbingContext();

  const { width, height } = imageSize;
  useEffect(() => {
    setImageSize({ width, height });
    setPhotoPath(photoPath);
    setRoutes(routes);
    setAreRoutesLoading(false);
  }, [
    height,
    photoPath,
    routes,
    setAreRoutesLoading,
    setImageSize,
    setPhotoPath,
    setRoutes,
    width,
  ]);

  return null;
};

export const RoutesLayerPure = ({
  routes,
  photoPath,
  imageSize,
}: RoutesLayerPureProps) => {
  const defaultWidth =
    typeof window !== 'undefined' ? window.innerWidth : 800;
  const defaultHeight =
    typeof window !== 'undefined' ? window.innerHeight : 600;

  const resolvedImageSize = useMemo(
    () => ({
      width: imageSize?.width ?? defaultWidth,
      height: imageSize?.height ?? defaultHeight,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageSize?.width ?? defaultWidth, imageSize?.height ?? defaultHeight],
  );

  return (
    <ClimbingContextProvider feature={EMPTY_FEATURE}>
      <Setup
        routes={routes}
        photoPath={photoPath}
        imageSize={resolvedImageSize}
      />
      <RoutesLayer isVisible />
    </ClimbingContextProvider>
  );
};
