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
import { editOne } from "@store/actions/categories"
import { useDispatch, useSelector } from "react-redux"

const SidebarNewUsers = ({ open, toggleSidebar, refresh }) => {
  // ** States
  // const [role, setRole] = useState("admin")
  const [catname, setCatname] = useState("")

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.categories.selected)

  useEffect(() => {
    setCatname(store.name)
  }, [store])

  // ** Vars
  const { register, errors, handleSubmit } = useForm()

  // ** Function to handle form submit
  const onSubmit = (values) => {
    if (isObjEmpty(errors)) {
      dispatch(
        editOne(
          store.id,
          {
            name: values.catname
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
      title={"Edit Category "}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label for="full-name">
            Name <span className="text-danger">*</span>
          </Label>
          <Input
            name="catname"
            id="full-name"
            value={catname}
            onChange={(e) => setCatname(e.target.value)}
            placeholder="Some eco category"
            innerRef={register({ required: true })}
            className={classnames({ "is-invalid": errors["full-name"] })}
          />
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

export default SidebarNewUsers
