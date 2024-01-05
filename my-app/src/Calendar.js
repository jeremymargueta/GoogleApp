import React, { useEffect, useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';

const config = {
  clientId: "324887570957-5icsh5nm4g0l6vto5f70m6iqd5nkoiqs.apps.googleusercontent.com",
  apiKey: "AIzaSyBHm7_nomtohiKayblwQYgT87IrosEa8XI",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
};

const apiCalendar = new ApiCalendar(config)

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Check if the user is already signed in
    if (apiCalendar.sign) {
      document.getElementById('sign-in-button').classList.add('authButtonInvisible');
      document.getElementById('sign-out-button').classList.remove('authButtonInvisible');
      
    } else {
      document.getElementById('sign-in-button').classList.remove('authButtonInvisible');
      document.getElementById('sign-out-button').classList.add('authButtonInvisible');
    
    }
  }, []);

  const sendEmail = async (attendee, summary, dateTime) => {
    try {
      const response = await fetch(`http://localhost:5184/email?email=${attendee}&summary=${summary}&datetime=${dateTime}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

    } catch (error) {
      console.log('making api request went wrong.')
      console.log('error: ', error);
    }
  };

  const sendReminderemail = async (event, meetingEvent) => {
      
    
    for(let i = 0; i < meetingEvent.attendees.length; i++){

      //find everyone but me
      if(meetingEvent.attendees[i].self !== true){
        //send email
        await sendEmail(meetingEvent.attendees[i].email, meetingEvent.summary, meetingEvent.start.dateTime);
      }
    }
  };

  const handleItemClick = async (event, name) => {

    if (name === 'sign-in') {
      await apiCalendar.handleAuthClick();
      document.getElementById('sign-in-button').classList.remove('authButtonVisible');
      document.getElementById('sign-out-button').classList.add('authButtonInvisible');
      
    } else if (name === 'sign-out') {
      await apiCalendar.handleSignoutClick();
      document.getElementById('sign-in-button').classList.add('authButtonVisible');
      document.getElementById('sign-out-button').classList.remove('authButtonInvisible');
    } 
    // Toggle class visibility after sign-in, sign-out, or send-email
    document.getElementById('sign-in-button').classList.toggle('authButtonInvisible');
    document.getElementById('sign-out-button').classList.toggle('authButtonInvisible');
  };

  const listUpcomingEvents = () => {
    apiCalendar.listEvents({
      timeMin: new Date().toISOString(),
      timeMax: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      showDeleted: true,
      maxResults: 10,
      orderBy: 'updated'
    }).then(({ result }) => {
      setEvents(result.items);
    });
  };

  

  return (
    <div className='container'>
      <div>
      <h1>Meeting Mate</h1>
      <button id="sign-in-button" className="authButtonVisible" onClick={(e) => handleItemClick(e, 'sign-in')}>Sign In</button>
      <button id="sign-out-button" className="authButtonInvisible" onClick={(e) => handleItemClick(e, 'sign-out')}>Sign Out</button>
      </div>

      <div>
        <h1>Upcoming Events</h1>
        <ul>
          {events.map(event => (
            <li key={event.id}>
              {event.summary} - {new Date(event.start.dateTime).toLocaleString()}
              <button className='reminderButton' onClick={(e) => sendReminderemail(e, event)}>Send Reminder Email</button>
            </li>
          ))}
        </ul>
        <button onClick={listUpcomingEvents}>List Upcoming Events</button>
      </div>
    </div>
  );
};

export default Calendar;