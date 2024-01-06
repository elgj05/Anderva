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
import { addOne } from "@store/actions/articles"
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
  // const [role, setRole] = useState("admin")
  // const [plan, setPlan] = useState('basic')
  const [submitting, setSubmitting] = useState(false),
    [imgPath, setImgPath] = useState(""),
    [content, setContent] = useState(
      EditorState.createWithContent(contentState)
    ),
    [featuredImg, setFeaturedImg] = useState(null)

  // ** Store Vars
  const dispatch = useDispatch()

  useEffect(() => {
    setContent(EditorState.createWithContent(contentState))
    setFeaturedImg(null)
    setSubmitting(false)
  }, [open])

  // ** Vars
  const { register, errors, handleSubmit } = useForm()

  // ** Function to handle form submit
  const onSubmit = (values) => {
    if (isObjEmpty(errors)) {
      setSubmitting(true)
      dispatch(
        addOne(
          {
            title: values.title,
            videoUrl: values.videourl,
            image: featuredImg,
            description: draftToHtml(convertToRaw(content.getCurrentContent()))
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
      title="New Article"
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
                innerRef={register({ required: true })}
                className={classnames({ "is-invalid": errors["full-name"] })}
              />
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label for="badd-videourl">Video URL</Label>
              <Input
                type="videourl"
                name="videourl"
                id="badd-videourl"
                placeholder="example: https://www.youtube.com/watch?v=3C6cP0zDFvA"
                innerRef={register({ required: false })}
                className={classnames({
                  "is-invalid": errors["badd-videourl"]
                })}
              />
              <FormText color="muted">A youtube video url if any</FormText>
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
