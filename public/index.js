loadTodos();
function credentialSignUpPage(){
    //clear the existing container
    const container=document.querySelector(".containers")
    container.innerHTML='';

    //adding credentials page
    const usernameInput=document.createElement('input');
    usernameInput.id="signUp-username";
    usernameInput.type="text";
    usernameInput.placeholder="username";

    const passwordInput=document.createElement('input');
    passwordInput.id="signUp-password";
    passwordInput.type="password";
    passwordInput.placeholder="password";

    // const link=document.createElement('a');
    // link.setAttribute('href','todo.html');

    const button=document.createElement('button');
    button.id="signUp-button";
    button.setAttribute("onclick","signUp()");
    button.innerHTML="Submit";

    // link.appendChild(button);

    container.appendChild(usernameInput);
    container.appendChild(passwordInput);
    container.appendChild(button);
}

function credentialSignInPage(){
    //clear the existing container
    const container=document.querySelector(".containers")
    container.innerHTML='';

    //adding credentials page
    const usernameInput=document.createElement('input');
    usernameInput.id="signIn-username";
    usernameInput.type="text";
    usernameInput.placeholder="username";

    const passwordInput=document.createElement('input');
    passwordInput.id="signIn-password";
    passwordInput.type="password";
    passwordInput.placeholder="password";

    // const link=document.createElement('a');
    // link.setAttribute('href','todo.html');

    const button=document.createElement('button');
    button.id="signIn-button";
    button.setAttribute("onclick","signIn()");
    button.innerHTML="Submit";

    // link.appendChild(button);

    container.appendChild(usernameInput);
    container.appendChild(passwordInput);
    container.appendChild(button);
}

function componentTodo(todo){
    const todoDiv=document.createElement('div');
    const todoHeading=document.createElement('h1');
    const delButton=document.createElement('button');

    todoHeading.innerHTML=todo.title;
    delButton.innerHTML='Delete';
    delButton.setAttribute('onclick',`deleteTodo(${todo.id})`);
    todoDiv.appendChild(todoHeading);
    todoDiv.appendChild(delButton);
    return todoDiv
}

async function addTodo(){
    const title=document.querySelector('input').value;
    
    try{
        const token=localStorage.getItem('token');
        await axios.post("http://localhost:3000/create",{title},{
            headers: {
                token: token
            }
        })
        document.querySelector('input').value='';   //clear the input field
        await loadTodos();
    }catch(error){
        console.error(error);
    }
}

async function deleteTodo(todoId){
    const token=localStorage.getItem('token');

    try{
        await axios.delete(`http://localhost:3000/delete/${todoId}`,{
            headers:{
                token: token
            }
        })
        await loadTodos();
    }catch(error){
        console.error(error);
    }
}

async function loadTodos(){
    const token=localStorage.getItem('token');

    try{
        const response=await axios.get('http://localhost:3000/todos',{
            headers: {
                token: token
            }
        })
        render(response.data);  //pass the fetched data to render 
    }catch(error){
        console.error(error);
    }
}

function render(todos){
    document.querySelector('#todos').innerHTML="";
    for(let i=0; i<todos.length; i++){
        const element=componentTodo(todos[i]);
        document.querySelector('#todos').appendChild(element);
    }
}

async function signUp(){
    const username=document.getElementById("signUp-username").value;
    const password=document.getElementById("signUp-password").value;
    
    await axios.post("http://localhost:3000/signUp",{
        username: username,
        password: password
    });
    alert("You have signed up");
    window.location.href="index.html"
}

async function signIn(){
    const username=document.getElementById("signIn-username").value;
    const password=document.getElementById("signIn-password").value;
    
    try{
        const response=await axios.post("http://localhost:3000/signIn",{
            username: username,
            password: password
        });
        
        if(response.data.token){
            localStorage.setItem("token", response.data.token);
            alert(response.data.message);
            window.location.href="todo.html";
        }

    }catch (error) {
        // Handle the error
        console.log(error);
        if (error.response && error.response.status === 403) {
          // Incorrect credentials or forbidden access
          alert('Sign-in failed: Incorrect username or password');
        } else if (error.request) {
          // No response received from the server (network issues, server down, etc.)
          alert('Sign-in failed: No response from server. Please try again later.');
        } else {
          // Any other errors (like issues with the Axios request itself)
          alert('Sign-in failed: An unexpected error occurred. Please try again.');
          console.error('Error details:', error.message); // Log error for debugging
        }
      }
}   