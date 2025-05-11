# Rental Connection Guide

This document explains how to use the rental connection feature in the CloudComputeMarketPlace application.

## Overview

The rental connection feature allows users to:

1. View all their active, pending, and completed rentals
2. Connect to active rentals using the built-in connection interface
3. Filter rentals by status (active, pending, completed, all)
4. View crucial rental information including dates, durations, and status

## How It Works

### For Renters

1. Once your rental is approved and active, go to the "My Rentals" page
2. Find your rental in the list, and click the "Connect Now" button
3. This opens a connection to your rented computer in the embedded interface
4. You can use the fullscreen button to maximize your workspace

### For Computer Owners

If you own computers that are rented out, you need to provide access details:

1. Go to the rental details page for the active rental
2. Add the necessary access information:
   - IP Address or hostname
   - Username
   - Password
   - Access URL (web-based access link)

### Technical Implementation

The connection system works as follows:

1. The backend stores access details securely in the rental document
2. The frontend fetches these details when loading the "My Rentals" page
3. When a user clicks "Connect Now", the interface loads the provided access URL
4. This loads a web-based remote desktop or connection interface in the iframe

## Development Notes

### Adding Test Access Details

For development purposes, you can run the access details seeder:

```
npm run seed:access
```

This will add test access URLs to all active rentals that don't already have access details.

### Default URLs for Testing

When access details aren't available, the system will use a sandbox URL for testing:

- Codepen: https://codepen.io/pen/
- CodeSandbox: https://codesandbox.io/s/new
- JSFiddle: https://jsfiddle.net/
- Replit: https://replit.com/languages/nodejs

In production, this should be changed to show an error message instead.

## Future Improvements

1. **Custom Connection Protocol**: Implement WebRTC or VNC for direct connection
2. **Enhanced Security**: Add encryption for access credentials
3. **Connection Monitoring**: Track connection usage time and resource utilization
4. **Connection Logs**: Keep records of all connections for security and billing
5. **Direct Terminal Access**: Add terminal emulation for command-line access

## Troubleshooting

If you're unable to connect to a rental:

1. Check if the rental is in "active" status
2. Verify that access details have been provided by the owner
3. Try refreshing the page or using a different browser
4. Contact the computer owner if problems persist
