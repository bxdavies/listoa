
// Event listener for enter key press to execute the same code as button press
document.getElementById('userInput').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("userInputButton").click();
    }
})

// Event listener for User Input Button Clicked
document.getElementById('userInputButton').addEventListener('click', (event) => {

    // Assign User Input to variable
    userInput = document.getElementById('userInput').value

    // Add the User Input to a Paragraph and add that to Message Box
    p = document.createElement('p');
    p.innerHTML = 'User: ' + userInput;
    document.getElementById('msg').appendChild(p)

    // Dictionary of Responses
    responses = {
        "hello": "Hello, How can I assist you today?",
        "speak with a human": "Sorry, no Humans are available right now",
        "i hate you": "Sorry, Did I do something wrong?",
        "how long does my order take to process": "Your order will be ready for collection 30 mins after the order is placed",
        "where are you based": "Cheltenham",
        "when do i need to collect my order by": "30 days from your order date",
        "why is the website so bad": "Because I'm a student"
    }

    // Get the response from the Dictionary
    response = responses[userInput.toLowerCase()]

    // If the response is undefined then set the response
    if (response === undefined)
    {
        response = "Sorry, I can't help you with that because I'm still learning."
    }

    // Add the response to a Paragraph and add that to the Message Box
    p = document.createElement('p');
    p.innerHTML = 'Bot: ' +  response;
    p.style.textAlign = 'right'
    document.getElementById('msg').appendChild(p)

    // Scroll to the bottom of the message box 
    document.getElementById('msg').scrollTop = document.getElementById('msg').scrollHeight;

    // Empty the message box
    userInput = '';

})