import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'qs'
import { QS_DEFAULT_PARSE } from '../common/constant'
import { useEffect } from 'react'

type MenuParams = {
  storeId: string
}

const Menu = () => {
  const location = useLocation()
  const params = qs.parse(location.search, QS_DEFAULT_PARSE) as MenuParams
  const navigate = useNavigate()

  useEffect(() => {
    if (!Number(params.storeId)) {
      navigate('/404')
    }
  }, [params, navigate])

  return (
    <div>
      <img src="http://localhost:8080/storage?path=test.png" />
    </div>
  )
}

export default Menu