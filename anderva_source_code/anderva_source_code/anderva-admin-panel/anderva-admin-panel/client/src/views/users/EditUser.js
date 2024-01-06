// ** React Import
import { useState, useEffect } from "react"

// ** Custom Components
import Sidebar from "@components/sidebar"

// ** Utils
import { isObjEmpty } from "@utils"

// ** Third Party Components
import classnames from "classnames"
import { useForm } from "react-hook-form"
import { Button, FormGroup, Label, FormText, Form, Input } from "reactstrap"

// ** Store & Actions
import { EditUser } from "@store/actions/users"
import { useDispatch, useSelector } from "react-redux"

const SidebarEditUser = ({ open, toggleSidebar, refresh }) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.users.selectedUser)

  // ** States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    setName(store.name)
    setEmail(store.email)
    setRole(store.role)
  }, [store])

  // ** Vars
  const { register, errors, handleSubmit } = useForm()

  // ** Function to handle form submit
  const onSubmit = (values) => {
    if (isObjEmpty(errors)) {
      dispatch(
        EditUser(
          store.id,
          {
            name: values["full-name"],
            password: values.password,
            role, // 'mobile', 'org', 'admin', 'subscriber'
            email: values.email
          },
          () => {
            toggleSidebar()
            refresh()
          }
        )
      )
    }
  }

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New User"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label for="edit-full-name">
            Full Name <span className="text-danger">*</span>
          </Label>
          <Input
            name="full-name"
            id="edit-full-name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            innerRef={register({ required: true })}
            className={classnames({
              "is-invalid": errors["edit-full-name"]
            })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="edit-email">
            Email <span className="text-danger">*</span>
          </Label>
          <Input
            type="email"
            name="email"
            id="edit-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
            innerRef={register({ required: true })}
            className={classnames({ "is-invalid": errors["edit-email"] })}
          />
          <FormText color="muted">
            You can use letters, numbers & periods
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label for="edit-password">
            Password
            {/* <span className="text-danger">*</span> */}
          </Label>
          <Input
            type="password"
            name="password"
            id="edit-password"
            placeholder=""
            innerRef={register({ required: false })}
            className={classnames({
              "is-invalid": errors["edit-password"]
            })}
          />
          <FormText color="muted">
            Type a password if you want to change it
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label for="edit-user-role">User Role</Label>
          <Input
            type="select"
            id="edit-user-role"
            name="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="org">Organization (event publishing user)</option>
          </Input>
        </FormGroup>
        <Button type="submit" className="mr-1" color="primary">
          Submit
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarEditUser
