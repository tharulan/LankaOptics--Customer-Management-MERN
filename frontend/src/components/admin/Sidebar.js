import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar () {

    const navigate = useNavigate();

    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                <li>
                    <Link to="/admin/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
                </li>
        
                <li>
                    
                    <Link to="/admin/users"> Order</Link>
                    <Link to="/admin/users"> products</Link>
                    <Link to="/admin/users"> Customers</Link>
                    <Link to="/admin/users"> Suppliers</Link>
                    <Link to="/admin/users"> Delivery</Link>
                    <Link to="/admin/users"> Employees</Link>
                    <Link to="/admin/users"> Finance</Link>
                    <Link to="/admin/users"> Coupons</Link>
                </li>

                
        
            </ul>
            </nav>
        </div>
    )
}