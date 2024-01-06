import axios from "axios"

// ** React Import
import { useState, useEffect } from "react"

// ** Custom Components
import Sidebar from "@components/sidebar"

// ** Utils
import { isObjEmpty, selectThemeColors } from "@utils"

import Select from "react-select"

import { Editor } from "react-draft-wysiwyg"
import htmlToDraft from "html-to-draftjs"
import draftToHtml from "draftjs-to-html"
import { EditorState, ContentState, convertToRaw } from "draft-js"

// ** Third Party Components
import classnames from "classnames"
import { useForm } from "react-hook-form"
import {
  Button,
  FormGroup,
  Label,
  FormText,
  Form,
  Input,
  Row,
  Col,
  Media,
  CustomInput
} from "reactstrap"

// ** Store & Actions
import { addBusiness } from "@store/actions/businesses"
import { useDispatch } from "react-redux"

import "@styles/react/libs/editor/editor.scss"
import "@styles/base/plugins/forms/form-quill-editor.scss"
import "@styles/react/libs/react-select/_react-select.scss"
import "@styles/base/pages/page-blog.scss"

const SidebarNew = ({ open, toggleSidebar, refresh }) => {
  const initialContent = ``

  const contentBlock = htmlToDraft(initialContent)
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  )
  const editorState = EditorState.createWithContent(contentState)

  // ** States
  const [submitting, setSubmitting] = useState(false),
    [content, setContent] = useState(
      EditorState.createWithContent(contentState)
    ),
    [featuredImg, setFeaturedImg] = useState(null),
    // [businessCategories, setBusinessCategories] = useState([]),
    [businessCategory, setBusinessCategory] = useState(null),
    [categories, setCategories] = useState([]),
    [imgPath, setImgPath] = useState("")

  useEffect(() => {
    axios.get("/categories?filter[limit]=1000").then((res) => {
      setCategories(
        res.data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      )
    })
  }, [])

  useEffect(() => {
    setContent(EditorState.createWithContent(contentState))
    setFeaturedImg(null)
    setBusinessCategory(null)
    setSubmitting(false)
  }, [open])

  // ** Store Vars
  const dispatch = useDispatch()

  const onImageChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files
    setImgPath(files[0].name)
    reader.onload = function () {
      setFeaturedImg(reader.result)
    }
    reader.readAsDataURL(files[0])
  }

  // ** Vars
  const { register, errors, handleSubmit } = useForm()

  // ** Function to handle form submit
  const onSubmit = (values) => {
    if (isObjEmpty(errors)) {
      setSubmitting(true)
      dispatch(
        addBusiness(
          {
            name: values.businessname,
            phone: values.phone,
            moreInfoUrl: values.moreinfourl,
            categoryId:
              businessCategory && businessCategory.value
                ? businessCategory.value
                : "",
            couponCode: values.couponcode,
            couponDescription: values.coupondescription,
            locationAddress: values.locationaddress,
            locationUrl: values.locationurl,
            description: draftToHtml(convertToRaw(content.getCurrentContent())),
            image: featuredImg
          },
          () => {
            toggleSidebar()
            refresh()
            setSubmitting(false)
          }
        )
      )
    }
  }

  return (
    <Sidebar
      size="lg"
      width={window.innerWidth > 980 ? 980 : window.innerWidth}
      open={open}
      title="New Business"
      headerClassName="mb-1"
      contentClassName="pt-1"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label for="badd-businessname">
                Business Name <span className="text-danger">*</span>
              </Label>
              <Input
                name="businessname"
                id="badd-businessname"
                placeholder="Ferma Tyre"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["badd-businessname"]
                })}
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup className="mb-2">
              <Label for="blog-edit-category">
                Category <span className="text-danger">*</span>
              </Label>
              <Select
                id="blog-edit-category"
                isClearable={false}
                theme={selectThemeColors}
                value={businessCategory}
                required={true}
                // isMulti
                name="categoryId"
                options={categories}
                className="react-select"
                classNamePrefix="select"
                onChange={(data) => setBusinessCategory(data)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label for="badd-email">
                Phone <span className="text-danger">*</span>
              </Label>
              <Input
                type="phone"
                name="phone"
                id="badd-phone"
                placeholder="+355681234567"
                innerRef={register({ required: true })}
                className={classnames({ "is-invalid": errors["badd-phone"] })}
              />
              <FormText color="muted">Suggested format: +355681020300</FormText>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label for="badd-moreinfourl">
                More Info URL <span className="text-danger">*</span>
              </Label>
              <Input
                type="moreinfourl"
                name="moreinfourl"
                id="badd-moreinfourl"
                placeholder="example: https://fermatyre.com"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["badd-moreinfourl"]
                })}
              />
              <FormText color="muted">
                Some URL for the "More Info" button
              </FormText>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label for="badd-couponcode">
                Coupon Code <span className="text-danger">*</span>
              </Label>
              <Input
                type="couponcode"
                name="couponcode"
                id="badd-couponcode"
                placeholder="example: DITAVERES200"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["badd-couponcode"]
                })}
              />
              <FormText color="muted">
                You can use letters and numbers. This will be used to generate
                QR Code
              </FormText>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="badd-coupondescription">
                Coupon Description <span className="text-danger">*</span>
              </Label>
              <Input
                type="coupondescription"
                name="coupondescription"
                id="badd-coupondescription"
                placeholder="example: Get 200 ALL off for every purchase"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["badd-coupondescription"]
                })}
              />
              <FormText color="muted">
                A description for what the coupon code offers
              </FormText>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="12" md="6">
            <FormGroup>
              <Label for="badd-locationaddress">
                Location Address <span className="text-danger">*</span>
              </Label>
              <Input
                type="locationaddress"
                name="locationaddress"
                id="badd-locationaddress"
                placeholder="Rr ABC, Pallati Magnet, Tirane, Albania"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["badd-locationaddress"]
                })}
              />
              <FormText color="muted">
                Used only to show the location text for the business
              </FormText>
            </FormGroup>
          </Col>
          <Col sm="12" md="6">
            <FormGroup>
              <Label for="badd-locationurl">
                Location URL <span className="text-danger">*</span>
              </Label>
              <Input
                type="locationurl"
                name="locationurl"
                id="badd-locationurl"
                placeholder="example: https://maps.google.com/..."
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["badd-locationurl"]
                })}
              />
              <FormText color="muted">
                URL redirecting the mobile user to a map url
              </FormText>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12" sm="12">
            <div className="border rounded p-1 mb-2">
              <h4 className="mb-1">Featured Image</h4>
              <Media className="flex-column flex-md-row">
                <img
                  className="rounded mr-2 mb-1 mb-md-0"
                  src={featuredImg}
                  alt="&nbsp; featured image"
                  width="auto"
                  height="110"
                />
                <Media body>
                  <small className="text-muted">
                    Required image resolution 402x268 (ratio 1.5), image size
                    max 2mb
                  </small>

                  <p className="my-50">
                    {/* <a href="/" onClick={(e) => e.preventDefault()}>
                      {imgPath}
                    </a> */}
                  </p>
                  <div className="d-inline-block">
                    <FormGroup className="mb-0">
                      <CustomInput
                        type="file"
                        id="exampleCustomFileBrowser"
                        name="image"
                        onChange={onImageChange}
                        accept=".jpg, .png, .gif"
                      />
                    </FormGroup>
                  </div>
                </Media>
              </Media>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <FormGroup className="mb-2">
              <Label>Description</Label>
              <Editor
                editorState={content}
                onEditorStateChange={(data) => setContent(data)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              type="submit"
              className="mr-1"
              color="primary"
              disabled={submitting}
            >
              Submit
            </Button>
            <Button
              type="reset"
              color="secondary"
              outline
              onClick={toggleSidebar}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Sidebar>
  )
}

export default SidebarNew
