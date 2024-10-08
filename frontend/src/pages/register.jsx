
import {useState} from "react";
import { Form, Button, Alert, FormGroup, Label, Input, InputGroup } from 'reactstrap';
import {Link} from 'react-router-dom';
import '../css/login.css'
import { API_URL } from '../config';
const apiUrl = API_URL;

// Main component for register page
export default function Register(){

    const [onSuccess, setOnSuccess] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    // Handlers for username and password
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
 

    // Handler for registering user
    function handleSubmit(e){
        e.preventDefault();
        fetch(`${apiUrl}/user/register`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
          })
          .then((response) => {
            // Throws an error if response is not ok
            if(!response.ok){
              return response.json().then(errorData => {
                  throw new Error(errorData.message); // Throw an Error with the error message from the response
              });  
            }
            return response.json(); 
          })
          .then(_ => {
            setOnSuccess(true);
            setPassword('');
            setUsername('')
          })
          .catch((error) => {
            setError(error);
          })
    };
    
    return(
    <>
    <div className="login">
      {/* Display sucess message if userscuessfully registers */}
    <Alert
      className="mb-2"
      isOpen={onSuccess}
      toggle={() => setOnSuccess(false)}
      >
      Sucessfully Registered User
    </Alert>
        <Form className="shadow p-4" onSubmit={handleSubmit}>
          <div className="h4 mb-2 text-center"><label>Register</label></div>
              {error !== null &&            
              <Alert
                  color="danger"
                  className="mb-2"
                  isOpen={error !== null}
                  toggle={() => setError(null)}
              >
                {error.message}
              </Alert>}
            <FormGroup>
              <Label className="loginLabel">Username</Label>
              <Input
              invalid={error !== null}
                type="text"
                value={username}
                placeholder="Username"
                onChange={handleUsernameChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label className="loginLabel">Password</Label>
              <InputGroup>
              <Input
              invalid={error !== null}
                type="password"
                value={password}
                placeholder="Password"
                onChange={handlePasswordChange}
                required
              />
              </InputGroup>
            </FormGroup>
            <Button className="w-100" type="submit" outline aria-label="Loading">
                      Register
              </Button>
              <div className="d-grid justify-content-end">
                  <Label className="registerLabel"><Link to="/login">Login</Link>
                  </Label>
              </div>
          </Form>
        </div>
        </>
    );
}