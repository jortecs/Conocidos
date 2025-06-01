import express from 'express';
import cors from 'cors';
import withSockets from './with-sockets';

const Middlewares = (app, io) => {
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(withSockets(io));
    app.use(cors()) // Use this after the variable declaration
};

export default Middlewares;