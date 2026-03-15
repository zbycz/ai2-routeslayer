import React from 'react';
import { render } from '@testing-library/react';
import { RoutesLayerPure } from '../RoutesLayerPure';
import type { ClimbingRoute } from '../../types';
import type { Feature } from '../../../../../services/types';

const PHOTO_URL = 'test-photo';

const SAMPLE_FEATURE: Feature = {
  type: 'Feature',
  osmMeta: { type: 'relation', id: 1 },
  tags: { name: 'Test Crag' },
  properties: { class: '', subclass: '' },
  center: [14.42, 50.08],
} as unknown as Feature;

const SAMPLE_ROUTES: ClimbingRoute[] = [
  {
    id: 'route-1',
    feature: { ...SAMPLE_FEATURE, osmMeta: { type: 'way', id: 101 } },
    updatedTags: { name: 'Route One' },
    paths: {
      [PHOTO_URL]: [
        { x: 0.25, y: 0.9, units: 'percentage' },
        { x: 0.27, y: 0.6, units: 'percentage' },
        { x: 0.24, y: 0.1, units: 'percentage', type: 'anchor' },
      ],
    },
  },
  {
    id: 'route-2',
    feature: { ...SAMPLE_FEATURE, osmMeta: { type: 'way', id: 102 } },
    updatedTags: { name: 'Route Two' },
    paths: {
      [PHOTO_URL]: [
        { x: 0.5, y: 0.9, units: 'percentage' },
        { x: 0.5, y: 0.1, units: 'percentage', type: 'anchor' },
      ],
    },
  },
];

const IMAGE_SIZE = { width: 800, height: 600 };

describe('RoutesLayerPure', () => {
  it('renders an svg element', () => {
    const { container } = render(
      <RoutesLayerPure
        routes={SAMPLE_ROUTES}
        imageSize={IMAGE_SIZE}
        photoPath={PHOTO_URL}
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('sets correct svg dimensions', () => {
    const { container } = render(
      <RoutesLayerPure
        routes={SAMPLE_ROUTES}
        imageSize={IMAGE_SIZE}
        photoPath={PHOTO_URL}
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe(String(IMAGE_SIZE.width));
    expect(svg?.getAttribute('height')).toBe(String(IMAGE_SIZE.height));
  });

  it('renders correct number of line segments for each route', () => {
    const { container } = render(
      <RoutesLayerPure
        routes={SAMPLE_ROUTES}
        imageSize={IMAGE_SIZE}
        photoPath={PHOTO_URL}
      />,
    );
    // route-1 has 3 points => 2 segments, route-2 has 2 points => 1 segment, total 3
    const lines = container.querySelectorAll('line');
    expect(lines).toHaveLength(3);
  });

  it('converts percentage coordinates to pixel positions', () => {
    const { container } = render(
      <RoutesLayerPure
        routes={[SAMPLE_ROUTES[1]]}
        imageSize={IMAGE_SIZE}
        photoPath={PHOTO_URL}
      />,
    );
    const line = container.querySelector('line');
    expect(line?.getAttribute('x1')).toBe(String(0.5 * IMAGE_SIZE.width));
    expect(line?.getAttribute('y1')).toBe(String(0.9 * IMAGE_SIZE.height));
    expect(line?.getAttribute('x2')).toBe(String(0.5 * IMAGE_SIZE.width));
    expect(line?.getAttribute('y2')).toBe(String(0.1 * IMAGE_SIZE.height));
  });

  it('renders nothing for routes with no path on the given photo', () => {
    const routeWithoutPhoto: ClimbingRoute = {
      id: 'route-no-photo',
      feature: SAMPLE_FEATURE,
      updatedTags: {},
      paths: {},
    };
    const { container } = render(
      <RoutesLayerPure
        routes={[routeWithoutPhoto]}
        imageSize={IMAGE_SIZE}
        photoPath={PHOTO_URL}
      />,
    );
    const lines = container.querySelectorAll('line');
    expect(lines).toHaveLength(0);
  });

  it('renders nothing when routes array is empty', () => {
    const { container } = render(
      <RoutesLayerPure
        routes={[]}
        imageSize={IMAGE_SIZE}
        photoPath={PHOTO_URL}
      />,
    );
    const lines = container.querySelectorAll('line');
    expect(lines).toHaveLength(0);
  });
});
