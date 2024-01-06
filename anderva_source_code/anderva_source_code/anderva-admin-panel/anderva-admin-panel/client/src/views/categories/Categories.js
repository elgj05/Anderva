// ** React Imports
// import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs"
import { Link } from "react-router-dom"

// ** Third Party Components
// import { Row, Col } from 'reactstrap'

// ** Tables
// import TableServerSide from './TableServerSide'
// import TableAdvSearch from './TableAdvSearch'
import AddCategory from "./AddCategory"
import EditCategory from "./EditCategory"

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss"

// ** React Imports
import { Fragment, useState, useEffect, memo } from "react"
import {
  ChevronDown,
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  Trash2,
  Archive
} from "react-feather"

// ** Table Columns
// import { serverSideColumns } from '../data'

// ** Store & Actions
import { getData, deleteOne, getOne } from "@store/actions/categories"
import { useSelector, useDispatch } from "react-redux"

// ** Third Party Components
import ReactPaginate from "react-paginate"
import DataTable from "react-data-table-component"
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap"

import moment from "moment"

const serverSideColumns = (onDelete, onEdit) => {
  return [
    {
      name: "Name",
      selector: "name",
      sortable: true,
      minWidth: "225px"
    },
    {
      name: "Created",
      selector: "createdAt",
      sortable: true,
      minWidth: "150px",
      cell: (row) => moment(row.createdAt).format("D MMMM Y @ HH:mm a")
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu right>
            {/* <DropdownItem
            tag={Link}
            to={`/apps/user/view/${row.id}`}
            className="w-100"
            // onClick={() => store.dispatch(getUser(row.id))}
          >
            <FileText size={14} className="mr-50" />
            <span className="align-middle">Details</span>
          </DropdownItem> */}
            <DropdownItem
              // tag={Link}
              // to={`/apps/user/edit/${row.id}`}
              className="w-100"
              onClick={() => {
                onEdit(row)
              }}
            >
              <Archive size={14} className="mr-50" />
              <span className="align-middle">Edit</span>
            </DropdownItem>
            <DropdownItem
              className="w-100"
              onClick={() => {
                onDelete(row)
              }}
            >
              <Trash2 size={14} className="mr-50" />
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    }
  ]
}

const DataTableServerSide = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.categories)

  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [searchValue, setSearchValue] = useState("")

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const toggleEditSidebar = () => setEditSidebarOpen(!editSidebarOpen)

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: searchValue
      })
    )
  }, [dispatch])

  const reset = () => {
    setSearchValue("")
    setCurrentPage(1)
    setRowsPerPage(7)

    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: searchValue
      })
    )
  }

  const refresh = () => {
    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: searchValue
      })
    )
  }

  const onDelete = (row) => {
    dispatch(deleteOne(row.id, refresh))
  }

  const onEdit = (row) => {
    dispatch(getOne(row.id, toggleEditSidebar))
  }

  // ** Function to handle filter
  const handleFilter = (e) => {
    setSearchValue(e.target.value)
    setCurrentPage(1)

    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: e.target.value
      })
    )
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    dispatch(
      getData({
        page: page.selected + 1,
        perPage: rowsPerPage,
        q: searchValue
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    dispatch(
      getData({
        page: currentPage,
        perPage: parseInt(e.target.value),
        q: searchValue
      })
    )
    setRowsPerPage(parseInt(e.target.value))
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    // const count = Number((store.total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={store.total}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
        }
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchValue
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      // return store.allData.slice(0, rowsPerPage)
      return []
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Categories Data</CardTitle>

          <AddCategory
            open={sidebarOpen}
            toggleSidebar={toggleSidebar}
            refresh={reset}
          />
          
          <EditCategory
            open={editSidebarOpen}
            toggleSidebar={toggleEditSidebar}
            refresh={refresh}
          />

        </CardHeader>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6">
            <div className="d-flex align-items-center">
              <Label for="sort-select">show</Label>
              <Input
                className="dataTable-select"
                type="select"
                id="sort-select"
                value={rowsPerPage}
                onChange={(e) => handlePerPage(e)}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for="sort-select">entries</Label>
            </div>
          </Col>
          <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="6"
          >
            <Label className="mr-1" for="search-input">
              Search
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
            />
            <Button.Ripple
              color="primary"
              onClick={toggleSidebar}
              style={{ marginLeft: 20 }}
              size="sm"
            >
              Add New
            </Button.Ripple>
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className="react-dataTable"
          columns={serverSideColumns(onDelete, onEdit)}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={dataToRender()}
        />
      </Card>
    </Fragment>
  )
}

const TableServerSide = memo(DataTableServerSide)

const Tables = () => {
  return (
    <Fragment>
      {/* <Breadcrumbs breadCrumbTitle='Users' breadCrumbParent='Home' breadCrumbActive='Users Data' /> */}
      <Row>
        <Col sm="12">
          <TableServerSide />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
