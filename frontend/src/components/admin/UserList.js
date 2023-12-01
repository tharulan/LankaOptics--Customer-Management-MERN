import { Fragment, useEffect } from "react"
import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { deleteUser, getUsers } from "../../actions/userActions"
import { clearError, clearUserDeleted } from "../../slices/userSlice"
import Loader from '../layouts/Loader';
import { MDBDataTable} from 'mdbreact';
import {toast } from 'react-toastify'
import Sidebar from "./Sidebar"

export default function UserList() {
    const { users = [], loading = true, error, isUserDeleted }  = useSelector(state => state.userState)

    const dispatch = useDispatch();

    const setUsers = () => {
        const data = {
            columns : [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Phone Number', // New field
                    field: 'phoneNumber', // New field
                    sort: 'asc',
                },
                {
                    label: 'Date of Birth', // New field
                    field: 'dateOfBirth', // New field
                    sort: 'asc',
                },
                {
                    label: 'Address', // New field
                    field: 'address', // New field
                    sort: 'asc',
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows : []
        };

        let idCounter=1;
        users.forEach( user => {
            data.rows.push({
                id: idCounter,
                role: user.role ,
                name: user.name,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                email : user.email,
                
                actions: (
                    <Fragment>
                    
                        <Link to={`/admin/userview/${user._id}`} className="btn btn-primary"><i className="fa fa-eye"></i></Link>&nbsp;
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary"><i className="fa fa-pencil"></i></Link>&nbsp;
                        <Button onClick={e => deleteHandler(e, user._id)} className="btn btn-primary"><i className="fa fa-trash"></i></Button>

                    </Fragment>
                ),
            });
            idCounter++;
        });

        return data;
    };

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteUser(id))
    }

    useEffect(() => {
        if(error) {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
        if(isUserDeleted) {
            toast('User Deleted Succesfully!',{
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearUserDeleted())
            })
            return;
        }

        dispatch(getUsers)
    },[dispatch, error, isUserDeleted])


    return (
        <div className="row">
        <div className="col-12 col-md-2">
                <Sidebar/>
        </div>
        <div className="col-12 col-md-10">
            <h1 className="my-4">User List</h1>
            <Fragment>
    {loading ? (
        <div className="loader-container">
            <Loader />
        </div>
    ) : (
        <div className="datatable-container">
            <MDBDataTable
                data={setUsers()}
                bordered
                striped
                hover
                className="px-3"
            />
        </div>
    )}
</Fragment>

        </div>
    </div>
    )
}


