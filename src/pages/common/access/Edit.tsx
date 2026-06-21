import { useParams } from 'react-router-dom'
import { adminProgramList } from '../adminProgram'
import NotFound404 from '../../404'

const Edit = () => {
  const { name } = useParams()
  if (!name) return null
  const currentComps = adminProgramList
    .map((program) => {
      if ('group' in program) {
        const { children } = program
        const component = children.find((ch) => ch.path.includes(name))
        return component?.editComponent
      }
      if (program.path.includes(name)) {
        return program.editComponent
      }
    })
    .find((dt) => dt)
  if (!currentComps) {
    return <NotFound404 />
  }
  const Component = currentComps
  // eslint-disable-next-line react-hooks/static-components
  return <Component />
}

export default Edit
