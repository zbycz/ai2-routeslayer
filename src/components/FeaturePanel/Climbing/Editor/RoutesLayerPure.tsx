import React from 'react';
import { ClimbingRoute, PathPoints, Size } from '../types';

type Props = {
  routes: ClimbingRoute[];
  imageSize: Size;
  photoPath: string;
};

const getPathPoints = (route: ClimbingRoute, photoPath: string): PathPoints =>
  route.paths[photoPath] ?? [];

export const RoutesLayerPure = ({ routes, imageSize, photoPath }: Props) => (
  <svg
    width={imageSize.width}
    height={imageSize.height}
    xmlns="http://www.w3.org/2000/svg"
  >
    {routes.map((route) => {
      const path = getPathPoints(route, photoPath);
      return path.slice(0, -1).map((point, segmentIndex) => {
        const nextPoint = path[segmentIndex + 1];
        return (
          <line
            key={`${route.id}-${segmentIndex}`}
            x1={point.x * imageSize.width}
            y1={point.y * imageSize.height}
            x2={nextPoint.x * imageSize.width}
            y2={nextPoint.y * imageSize.height}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      });
    })}
  </svg>
);
