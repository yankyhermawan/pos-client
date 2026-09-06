import type { Options } from './global_interface'

type GetOptions<T extends Record<string, unknown>> = {
  selectedValues: (string | number)[]
  options: T[]
  label: keyof T
  value: keyof T
}

export const getOptions = <T extends Record<string, unknown>>({
  selectedValues,
  options,
  label,
  value,
}: GetOptions<T>): Options[] => {
  return options.map((dt) => ({
    disabled: selectedValues.includes(dt[value] as string | number),
    label: dt[label] as string,
    value: dt[value] as string | number,
  }))
}
