// ** React Import
import { useState, useEffect } from "react"

// ** Custom Components
import Sidebar from "@components/sidebar"

// ** Utils
import { isObjEmpty } from "@utils"

import { Editor } from "react-draft-wysiwyg"
import htmlToDraft from "html-to-draftjs"
import draftToHtml from "draftjs-to-html"
import { EditorState, ContentState, convertToRaw } from "draft-js"

// ** Third Party Components
import classnames from "classnames"
import { useForm, Controller } from "react-hook-form"
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
import { editOne } from "@store/actions/events"
import { useDispatch, useSelector } from "react-redux"
import Flatpickr from "react-flatpickr"

import "@styles/react/libs/editor/editor.scss"
import "@styles/base/plugins/forms/form-quill-editor.scss"
import "@styles/react/libs/react-select/_react-select.scss"
import "@styles/base/pages/page-blog.scss"

import "@styles/react/libs/flatpickr/flatpickr.scss"

const SidebarNew = ({ open, toggleSidebar, refresh }) => {
  const initialContent = ``

  const contentBlock = htmlToDraft(initialContent)
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  )
  const editorState = EditorState.createWithContent(contentState)

  // ** States
  const [submitting, setSubmitting] = useState(false),
    [imgPath, setImgPath] = useState(""),
    [content, setContent] = useState(
      EditorState.createWithContent(contentState)
    ),
    [featuredImg, setFeaturedImg] = useState(null),
    [title, setTitle] = useState(""),
    [eventurl, setEventurl] = useState(""),
    [location, setLocation] = useState(""),
    [startPicker, setStartPicker] = useState(new Date()),
    [endPicker, setEndPicker] = useState(new Date())

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.events.selected)

  useEffect(() => {
    if (Object.keys(store).length) {
      setContent(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(store.description || "<p></p>")
          )
        )
      )
      setFeaturedImg(store.image)
      setTitle(store.title)
      setEventurl(store.eventUrl)
      setLocation(store.location)
      setStartPicker(new Date(store.datetimeStart))
      setEndPicker(new Date(store.datetimeEnd))
    } else {
      setContent(EditorState.createWithContent(contentState))
      setFeaturedImg(null)
      setTitle("")
      setEventurl("")
      setLocation("")
      setStartPicker(new Date())
      setEndPicker(new Date())
    }
    setSubmitting(false)
  }, [open, store])

  // ** Vars
  const { register, errors, handleSubmit, control } = useForm()

  // ** Function to handle form submit
  const onSubmit = (values) => {
    if (isObjEmpty(errors)) {
      setSubmitting(true)
      dispatch(
        editOne(
          store.id,
          {
            title,
            image: featuredImg,
            description: draftToHtml(convertToRaw(content.getCurrentContent())),
            eventUrl: eventurl,
            location,
            datetimeStart: startPicker.toISOString(),
            datetimeEnd: endPicker.toISOString()
          },
          () => {
            toggleSidebar()
            refresh()
            setSubmitting(false)
          },
          () => {
            setSubmitting(false)
          }
        )
      )
    }
  }

  const onImageChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files
    setImgPath(files[0].name)
    reader.onload = function () {
      setFeaturedImg(reader.result)
    }
    reader.readAsDataURL(files[0])
  }

  return (
    <Sidebar
      size="lg"
      width={window.innerWidth > 980 ? 980 : window.innerWidth}
      open={open}
      title="New Event"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label for="full-name">
                Title <span className="text-danger">*</span>
              </Label>
              <Input
                name="title"
                id="full-name"
                placeholder="Some title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                innerRef={register({ required: true })}
                className={classnames({ "is-invalid": errors["full-name"] })}
              />
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label for="badd-eventurl">
                Event URL <span className="text-danger">*</span>
              </Label>
              <Input
                type="eventurl"
                name="eventurl"
                id="badd-eventurl"
                value={eventurl}
                onChange={(e) => setEventurl(e.target.value)}
                placeholder="example: https://fb.com/123"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["badd-eventurl"]
                })}
              />
              <FormText color="muted">Event url</FormText>
            </FormGroup>
          </Col>

          <Col md="3">
            {/* <FormGroup>
              <Label className="d-block" for="datetimestart">
                Date Time Start
              </Label>
              <Flatpickr
                required
                id="datetimestart"
                // tag={Flatpickr}
                name="datetimestart"
                onChange={(date) => setStartPicker(date[0])}
                value={startPicker}
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i"
                  // time_24hr: true,
                  // minDate: "today",
                  // locale: {
                  //   firstDayOfWeek: 1
                  // }
                }}
                className={classnames("form-control", {
                  "is-invalid": errors.datetimestart
                })}
              />
            </FormGroup> */}

            <FormGroup>
              <Label for="startDate">Start Date Time of event</Label>
              <Flatpickr
                required
                id="startDate"
                // tag={Flatpickr}
                name="startDate"
                className="form-control"
                onChange={(date) => setStartPicker(date[0])}
                value={startPicker}
                options={{
                  enableTime: true,
                  dateFormat: "H:i \\@ d F Y",
                  minDate: "today",
                  time_24hr: true,
                  locale: {
                    firstDayOfWeek: 1
                  }
                }}
              />
            </FormGroup>
          </Col>

          <Col md="3">
            <FormGroup>
              <Label for="endDate">End Date Time of event</Label>
              <Flatpickr
                required
                id="endDate"
                // tag={Flatpickr}
                name="endDate"
                className="form-control"
                onChange={(date) => setEndPicker(date[0])}
                value={endPicker}
                options={{
                  enableTime: true,
                  dateFormat: "H:i \\@ d F Y",
                  minDate: "today",
                  time_24hr: true,
                  locale: {
                    firstDayOfWeek: 1
                  }
                }}
              />
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label for="badd-location">
                Location <span className="text-danger">*</span>
              </Label>
              <Input
                type="location"
                name="location"
                id="badd-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="example: Tirane, Albania"
                innerRef={register({ required: true })}
                className={classnames({
                  "is-invalid": errors["badd-location"]
                })}
              />
              <FormText color="muted">
                Event location address, usually city name
              </FormText>
            </FormGroup>
          </Col>

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

        <Button
          type="submit"
          className="mr-1"
          color="primary"
          disabled={submitting}
        >
          Submit
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNew
