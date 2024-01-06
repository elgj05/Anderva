import axios from "axios"

// ** React Import
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

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
import { editBusiness } from "@store/actions/businesses"

import "@styles/react/libs/editor/editor.scss"
import "@styles/base/plugins/forms/form-quill-editor.scss"
import "@styles/react/libs/react-select/_react-select.scss"
import "@styles/base/pages/page-blog.scss"

const SidebarEdit = ({ open, toggleSidebar, refresh }) => {
  const initialContent = ``

  const contentBlock = htmlToDraft(initialContent)
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  )
  const editorState = EditorState.createWithContent(contentState)

  const store = useSelector((state) => state.businesses.selectedBusiness)

  // ** States
  const [content, setContent] = useState(
      EditorState.createWithContent(contentState)
    ),
    [featuredImg, setFeaturedImg] = useState(null),
    [submitting, setSubmitting] = useState(false),
    // [businessCategories, setBusinessCategories] = useState([]),
    [businessCategory, setBusinessCategory] = useState(null),
    [categories, setCategories] = useState([]),
    [imgPath, setImgPath] = useState(""),
    [businessname, setBusinessname] = useState(""),
    [phone, setPhone] = useState(""),
    [moreinfourl, setMoreinfourl] = useState(""),
    [couponcode, setCouponcode] = useState(""),
    [coupondescription, setCoupondescription] = useState(""),
    [locationaddress, setLocationaddress] = useState(""),
    [locationurl, setLocationurl] = useState("")

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
    setContent(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          htmlToDraft(store.description || "<p></p>")
        )
      )
    )
    setFeaturedImg(store.image || null)
    setBusinessCategory(
      store.category
        ? {
            value: store.category.id,
            label: store.category.name
          }
        : null
    )
    setBusinessname(store.name)
    setPhone(store.phone)
    setMoreinfourl(store.moreInfoUrl)
    setCouponcode(store.couponCode)
    setCoupondescription(store.couponDescription)
    setLocationaddress(store.locationAddress)
    setLocationurl(store.locationUrl)

    setSubmitting(false)
  }, [store])

  //   axios
  //     .get(`/businesses/${id}`)
  //     .then(res => {
  //       //
  //     })

  //   axios.get('/blog/list/data/edit').then(res => {
  //     setData(res.data)
  //     setTitle(res.data.blogTitle)
  //     setSlug(res.data.slug)
  //     setBlogCategories(res.data.blogCategories)
  //     setFeaturedImg(res.data.featuredImage)
  //     setStatus(res.data.status)
  //   })

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
        editBusiness(
          store.id,
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
      title="Edit Business"
      headerClassName="mb-1"
      contentClassName="pt-1"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="4">
            <FormGroup>
              <Label for="bedit-businessname">
                Business Name <span className="text-danger">*</span>
              </Label>
              <Input
                name="businessname"
                id="bedit-businessname"
                value={businessname}
                onChange={(e) => setBusinessname(e.target.value)}
                placeholder="Ferma Tyre"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["bedit-businessname"]
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
              <Label for="bedit-email">
                Phone <span className="text-danger">*</span>
              </Label>
              <Input
                type="phone"
                name="phone"
                id="bedit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+355681234567"
                innerRef={register({ required: true })}
                className={classnames({ "is-invalid": errors["bedit-phone"] })}
              />
              <FormText color="muted">Suggested format: +355681020300</FormText>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label for="bedit-moreinfourl">
                More Info URL <span className="text-danger">*</span>
              </Label>
              <Input
                type="moreinfourl"
                name="moreinfourl"
                id="bedit-moreinfourl"
                value={moreinfourl}
                onChange={(e) => setMoreinfourl(e.target.value)}
                placeholder="example: https://fermatyre.com"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["bedit-moreinfourl"]
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
              <Label for="bedit-couponcode">
                Coupon Code <span className="text-danger">*</span>
              </Label>
              <Input
                type="couponcode"
                name="couponcode"
                id="bedit-couponcode"
                value={couponcode}
                onChange={(e) => setCouponcode(e.target.value)}
                placeholder="example: DITAVERES200"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["bedit-couponcode"]
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
              <Label for="bedit-coupondescription">
                Coupon Description <span className="text-danger">*</span>
              </Label>
              <Input
                type="coupondescription"
                name="coupondescription"
                id="bedit-coupondescription"
                value={coupondescription}
                onChange={(e) => setCoupondescription(e.target.value)}
                placeholder="example: Get 200 ALL off for every purchase"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["bedit-coupondescription"]
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
              <Label for="bedit-locationaddress">
                Location Address <span className="text-danger">*</span>
              </Label>
              <Input
                type="locationaddress"
                name="locationaddress"
                id="bedit-locationaddress"
                value={locationaddress}
                onChange={(e) => setLocationaddress(e.target.value)}
                placeholder="Rr ABC, Pallati Magnet, Tirane, Albania"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["bedit-locationaddress"]
                })}
              />
              <FormText color="muted">
                Used only to show the location text for the business
              </FormText>
            </FormGroup>
          </Col>
          <Col sm="12" md="6">
            <FormGroup>
              <Label for="bedit-locationurl">
                Location URL <span className="text-danger">*</span>
              </Label>
              <Input
                type="locationurl"
                name="locationurl"
                id="bedit-locationurl"
                value={locationurl}
                onChange={(e) => setLocationurl(e.target.value)}
                placeholder="example: https://maps.google.com/..."
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["bedit-locationurl"]
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

export default SidebarEdit
