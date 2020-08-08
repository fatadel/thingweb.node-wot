WoTHelpers.fetch('http://127.0.0.1:9090/urn-dev-wot-example-coffee-machine-97e83de1-f5c9-a4a0-23b6-be918d3a22ca').then(async (td) => {
    try {
        let thing = await WoT.consume(td);
        log('Thing Description:', td);

        // Read property allAvailableResources
        let allAvailableResources = await thing.readProperty('allAvailableResources');
        log('allAvailableResources value is:', allAvailableResources);
        
        // Now let's change water level to 80
        allAvailableResources['water'] = 80
        await thing.writeProperty('allAvailableResources', {'value': allAvailableResources});
        
        // And see that the water level has changed
        allAvailableResources = await thing.readProperty('allAvailableResources');
        log('allAvailableResources value after change is:', allAvailableResources);

        // It's also possible to set a client-side handler for observable properties
        thing.observeProperty('maintenanceNeeded', (data) => {
            log('maintenanceNeeded property has changed! New value is:', data);
        });

        // Now let's make 3 cups of latte!
        let makeCoffee = await thing.invokeAction('makeDrink', {'input': {'drinkId': 'latte', 'size': 'l', 'quantity': 3}});
        log('makeDrink action invocation id is:', makeCoffee);

        // See how allAvailableResources property value has changed
        allAvailableResources = await thing.readProperty('allAvailableResources');
        log('allAvailableResources value is:', allAvailableResources);

        // Let's add a scheduled task
        let scheduledTask = await thing.invokeAction('setSchedule', {'input': {
            'drinkId': 'espresso',
            'size': 'm',
            'quantity': 2,
            'time': '10:00',
            'mode': 'everyday'
        }});
        log('setSchedule action invocation id is:', scheduledTask);

        // See how it has been added to the schedules property
        let schedules = await thing.readProperty('schedules');
        log('schedules value: ', schedules);

        // Let's set up a handler for outOfResource event
        thing.subscribeEvent('outOfResource', (data) => {
            // Here we are simply logging the message when the event is emitted
            // But, of course, could have a much more sophisticated handler
            log('outOfResource event:', data);
        });

    } catch (err) {
        console.error('Script error:', err);
    }
    
});


// Print data and an accompanying message in a distinguishable way
function log(msg, data) {
    console.info('======================');
    console.info(msg);
    console.dir(data);
    console.info('======================');
}
