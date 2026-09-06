import { Container, Stack } from '@mui/material'
import { Card } from '../components/card/Card'
import Form from '../components/form/Form'
import FormTextInput from '../components/form_input/Text'
import { LoginFormSchema } from './schema'
import type z from 'zod'
import { useLoginStore } from './store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  cookieKeys,
  getCookiesValue,
  removeCookies,
  setCookiesValue,
} from '../utility/local_storage'
import { Button } from '../components/button/Button'

const Login = () => {
  const { data, login, isActionLoading, isActionSuccess } = useLoginStore()
  const handleSubmit = (values: z.infer<typeof LoginFormSchema>) => {
    login(values)
  }
  const navigate = useNavigate()
  const token = getCookiesValue('token')

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
      return
    } else {
      cookieKeys.map((key) => removeCookies(key))
    }
  }, [])

  useEffect(() => {
    if (!isActionLoading && isActionSuccess && data) {
      setCookiesValue('token', data.token, 1, 'day')
      navigate('/dashboard')
    }
  }, [isActionLoading, isActionSuccess, navigate, data])

  return (
    <Container className='w-screen h-screen flex justify-center items-center'>
      <Card title='Login'>
        <Form schema={LoginFormSchema} onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormTextInput label='Username' name='username' />
            <FormTextInput label='Password' name='password' type='password' />
            <Button type='submit' variant='contained'>
              Submit
            </Button>
          </Stack>
        </Form>
      </Card>
    </Container>
  )
}

export default Login
