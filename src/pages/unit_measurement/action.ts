import { get } from '../utility/requests'
import type { UnitMeasurement } from './interface'

export const getUnitMeasurements = () =>
  get<UnitMeasurement[]>('/unitmeasurement')
