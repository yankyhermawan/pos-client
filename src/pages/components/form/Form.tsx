import { useForm, FormProvider, type DefaultValues } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { JSX } from 'react/jsx-runtime'
import { useEffect } from 'react'

type FormProps<TSchema extends z.ZodObject> = {
  children: JSX.Element[] | JSX.Element
  existingValue?: z.input<TSchema>
  onSubmit: (val: z.output<TSchema>) => void
  schema: TSchema
}

const getDefaultValues = <T extends z.ZodObject>(schema: z.ZodObject<z.core.$ZodLooseShape, z.core.$strip>) => {
  const jsonSchema = schema.toJSONSchema().properties
  if (!jsonSchema) return {} as DefaultValues<z.input<T>>
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(jsonSchema)) {
    const val = jsonSchema[key] as {
      default?: unknown
      type: string
    }

    if (val.default !== undefined) {
      result[key] = val.default
    } else if (val.type === 'string') {
      result[key] = ''
    }
  }

  return result as DefaultValues<z.input<T>>
}

const Form = <T extends z.ZodObject>(props: FormProps<T>) => {
  const { children, existingValue, onSubmit, schema } = props
  const formData = useForm<z.input<T>, unknown, z.output<T>>({
    defaultValues: getDefaultValues(schema),
    mode: 'onSubmit',
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (existingValue) {
      formData.setValues(existingValue)
    }
  }, [existingValue, formData])

  return (
    <FormProvider {...formData}>
      <form onSubmit={formData.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  )
}

export default Form