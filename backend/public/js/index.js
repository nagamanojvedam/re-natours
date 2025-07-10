/* eslint-disable */
import 'regenerator-runtime/runtime';

import { login } from './login';
import { logout } from './logout';
import { updateSettings } from './updateSettings';
import { displayMap } from './mapbox';
import { showAlert } from './alerts';
import { bookTour } from './stripe';
import { signup } from './signup';

const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const mapBox = document.getElementById('map');
const bookBtn = document.getElementById('book-tour');
const body = document.querySelector('body');
const signupForm = document.querySelector('.form--signup');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset['locations']);
  displayMap(locations);
}

loginForm?.addEventListener('submit', (evnt) => {
  evnt.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});

logoutButton?.addEventListener('click', logout);

userDataForm?.addEventListener('submit', (evnt) => {
  evnt.preventDefault();

  const formData = new FormData();

  formData.append('name', document.getElementById('name').value);
  formData.append('email', document.getElementById('email').value);

  const photo = document.getElementById('photo').files[0];
  if (photo) formData.append('photo', photo);

  updateSettings(formData, 'data');
});

userPasswordForm?.addEventListener('submit', (evnt) => {
  evnt.preventDefault();

  const passwordCurrent = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;

  const data = {
    passwordCurrent,
    password,
    passwordConfirm,
  };

  updateSettings(data, 'password');

  passwordCurrent = password = passwordConfirm = '';
});

bookBtn?.addEventListener('click', (evnt) => {
  evnt.target.textContext = 'Processing...';
  const { tourId } = evnt.target.dataset;
  bookTour(tourId);
});

const alertMessage = body.dataset['alert'];

if (alertMessage) {
  showAlert('success', alertMessage, 20);
}

signupForm?.addEventListener('submit', (evnt) => {
  evnt.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const passwordConfirm = document.getElementById('passwordConfirm').value;

  const data = {
    name,
    email,
    password,
    passwordConfirm,
  };

  signup(data);
});
