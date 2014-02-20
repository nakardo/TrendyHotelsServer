TrendyHotelsServer
==================

A simple Engine.IO server for TrendyHotels App

[![Build Status](https://travis-ci.org/dmacosta/TrendyHotelsServer.png)](https://travis-ci.org/dmacosta/TrendyHotelsServer)

##Configuration

TrendyHotels Server uses [Booking.com][0] API, which is currently private and authenticated. In order to work, it requires to have the user and password configured.

    $ export BOOKING_API_AUTH_USER='<username>'
    $ export BOOKING_API_AUTH_PASSWORD='<password>'
    
##Start Up

You'll have to download the dependencies before starting the server.

    $ npm install
    $ node app.js
    
##Client

The client app source is available to download from [here][1].

License
=======

    The MIT License (MIT)
    
    Copyright (c) 2014 Diego Acosta
    
    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: http://www.booking.com/
[1]: https://github.com/dmacosta/TrendyHotels


