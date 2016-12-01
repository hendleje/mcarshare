# mcarshare

## Usage
Please create an own user with a valid email address to use the system.
Short description how to run our application

## Structure of documentation
All the use cases, sequence diagrams and other documentation can be found in the assignments 1, 2 and 3.

The public folder contains all the .json files with the persistent data.
Also the images, stylesheets and data used for the different views is located in that folder.

The routes folder contains all .js files which represent the different classes of our system and provide basic methods. Methods are commented to explain what happens.

The views folder contains all .hjs files which are the views shown as the user goes through the system.

The app.js file contains most of the calculation, redirection and checks. There are .get methods for every view and for some are also .post methods, in which data is processed. The single steps of the functions are commented.

## Functionality implemented
All the use cases are implemented as describe in assignment 3.
The descriptions below give more details and name some restrictions.

All the data is persistently stored in .json files. 
There are some exemplary cars created.

Use Case RegisterNewMember:
Please use a valid email-address to be able to verify your account.
The login won't be possible until you have verified your account.

Login:
The customer logs in with his email address and password.
The system checks, if the email address and the password match, if not a message will be shown.
The system also checks, if the account was verified, if not a message will be shown.
If all the checks were positive, the customer will be redirected to the findcar page.

Use Case Billing:
The System creates a bill and send it to the customer's email address once the car is returned.
For this version the bill is paid by clicking on the link in the email sent.

Use Case FindCar:
The customer can input preferences and the system will show all cars available at the moment (choosing date and time is not possible, it will always be the cars available NOW).
Once the user clicks on a car displayed in the search results, it will see the details of that car and can click the button to reserve that car now.

Use Case ReserveCar:
Reserving a car is always for the current point in time.
Once the customer clicks on the button to reserve the car, the system checks if all the previous bills are paid. If not, the user will receive a message to do so before being able to reserve a car.
The directions to the car are now shown. The location of the user is retrieved from the device he is using.
If the user logs out at that point, the car will be available again and the user has to reserve it again.

Use Case CheckoutCar:
The trip begins and a short information about the current is shown.
As the rental agreement is created and saved persistently, the user may now logout and still be able to view the current trip information and to checkout the car later.

Use Case ReturnCar:
The location of the user is again retrieved from his device, the car can only be returned, if the user is at one of the designated locations.

## Point Distribution
Short description, how to run your application. Structure of your documentation (what can be found where). What functionality have you implemented. Point distribution for the group members

## Developing

### Tools
Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.