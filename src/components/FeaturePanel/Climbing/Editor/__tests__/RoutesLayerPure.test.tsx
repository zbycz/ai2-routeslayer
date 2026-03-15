import React from 'react';
import { act, render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RoutesLayerPure } from '../RoutesLayerPure';
import type { Feature } from '../../../../../services/types';
import type { ClimbingRoute } from '../../types';

jest.mock('../../../../utils/TicksContext', () => ({
  useTicksContext: () => ({ isTicked: () => false }),
}));

jest.mock('../../../../utils/userSettings/UserSettingsContext', () => ({
  useUserSettingsContext: () => ({
    userSettings: { 'climbing.isGradesOnPhotosVisible': false },
  }),
}));

const climbingTheme = createTheme({
  palette: {
    climbing: {
      active: '#00854d',
      inactive: '#f6f6f6',
      border: '#555555',
      selected: '#000000',
    },
  } as any,
});

const PHOTO_URL = 'test-photo';

const SAMPLE_FEATURE: Feature = {
  type: 'Feature',
  osmMeta: { type: 'relation', id: 1 },
  tags: { name: 'Test Crag', sport: 'climbing' },
  properties: { class: '', subclass: '' },
  center: [0, 0],
};

const SAMPLE_ROUTES: ClimbingRoute[] = [
  {
    id: 'route-1',
    feature: { ...SAMPLE_FEATURE, osmMeta: { type: 'way', id: 101 } },
    updatedTags: { name: 'Route One', 'climbing:grade:uiaa': '5+' },
    paths: {
      [PHOTO_URL]: [
        { x: 0.25, y: 0.9, units: 'percentage' },
        { x: 0.26, y: 0.5, units: 'percentage' },
        { x: 0.25, y: 0.1, units: 'percentage', type: 'anchor' },
      ],
    },
  },
  {
    id: 'route-2',
    feature: { ...SAMPLE_FEATURE, osmMeta: { type: 'way', id: 102 } },
    updatedTags: { name: 'Route Two', 'climbing:grade:uiaa': '6a' },
    paths: {
      [PHOTO_URL]: [
        { x: 0.5, y: 0.9, units: 'percentage' },
        { x: 0.51, y: 0.5, units: 'percentage' },
        { x: 0.5, y: 0.1, units: 'percentage', type: 'anchor' },
      ],
    },
  },
];

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={climbingTheme}>{ui}</ThemeProvider>);

describe('RoutesLayerPure', () => {
  it('renders an SVG element', async () => {
    await act(async () => {
      renderWithTheme(
        <RoutesLayerPure
          routes={SAMPLE_ROUTES}
          photoPath={PHOTO_URL}
          imageSize={{ width: 800, height: 600 }}
        />,
      );
    });

    expect(document.querySelector('svg')).not.toBeNull();
  });

  it('renders SVG line segments for each route', async () => {
    await act(async () => {
      renderWithTheme(
        <RoutesLayerPure
          routes={SAMPLE_ROUTES}
          photoPath={PHOTO_URL}
          imageSize={{ width: 800, height: 600 }}
        />,
      );
    });

    // Each route with 3 path points produces 2 segments, rendered twice (border + fill)
    const lines = document.querySelectorAll('svg line');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('renders nothing when routes have no paths for the given photoPath', async () => {
    const routesWithoutPhoto: ClimbingRoute[] = [
      {
        id: 'route-empty',
        feature: { ...SAMPLE_FEATURE, osmMeta: { type: 'way', id: 200 } },
        updatedTags: { name: 'Empty Route' },
        paths: {},
      },
    ];

    await act(async () => {
      renderWithTheme(
        <RoutesLayerPure
          routes={routesWithoutPhoto}
          photoPath={PHOTO_URL}
          imageSize={{ width: 800, height: 600 }}
        />,
      );
    });

    // SVG is rendered but contains no line segments
    expect(document.querySelector('svg')).not.toBeNull();
    expect(document.querySelectorAll('svg line')).toHaveLength(0);
  });
});
