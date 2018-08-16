//class under test
const root = require('../redux.js');

//test framework dependencies
const expect = require('chai').expect;
const requirejs = require('requirejs');

//application dependencies
const Redux = require('redux');

describe('Redux', ()=> {

    beforeEach(()=> {
    });

    it('should take initial state if no state are stored', ()=> {

        //given
        let initialState = {
            schemaVersion:350, //last modified db schema with git tag
            debug:{}, //mandatory field
            someProperty: "initial property value"
        };

        let savedState = null;

        let config = {
            loadState: () => savedState,
            shouldStoreState:false,
            createStore:(reducers,initialState)=>Redux.createStore(reducers, initialState)
        };

        //expect
        let expectedState = {
            schemaVersion:350,
            someProperty:"initial property value"
        };

        //execute
        let redux = root.srtPlayer.ReduxImpl(initialState,config);
        let resultState = redux.getState();

        //assert
        expect(resultState.schemaVersion).to.equal(expectedState.schemaVersion);
        expect(resultState.someProperty).to.equal(expectedState.someProperty);

    });

    it('should not reset state if stored schema version is unmodified', ()=> {

        //given
        let initialState = {
            schemaVersion:350,
            debug:{}, //mandatory field
            someProperty: "initial property value"
        };

        let savedState =  {
            schemaVersion:350,
            debug:{}, //mandatory field
            someProperty: "saved property value"
        };

        let config = {
            loadState: () => savedState,
            shouldStoreState:false,
            createStore:(reducers,initialState)=>Redux.createStore(reducers, initialState)
        };

        //expect
        let expectedState = {
            schemaVersion:350,
            someProperty:"saved property value"
        };

        //execute
        let redux = root.srtPlayer.ReduxImpl(initialState,config);
        let resultState = redux.getState();

        //assert
        expect(resultState.schemaVersion).to.equal(expectedState.schemaVersion);
        expect(resultState.someProperty).to.equal(expectedState.someProperty);

    });


    it('should reset state if initial schema version is higher than stored schema version', ()=> {
        //given
        let initialState = {
            schemaVersion: 351,
            debug:{}, //mandatory field
            addedProperty: "added in schema 351"
        };

        let savedState =  {
            schemaVersion:350,
            debug:{}, //mandatory field
            removedProperty: "saved property value"
        };

        let config = {
            loadState: () => savedState,
            shouldStoreState:false,
            createStore:(reducers,initialState)=>Redux.createStore(reducers, initialState)
        };

        //expect
        let expectedState = {
            schemaVersion:351,
            someProperty:"initial property value",
            addedProperty: "added in schema 351"
        };

        //execute
        let redux = root.srtPlayer.ReduxImpl(initialState,config);
        let resultState = redux.getState();

        //assert
        expect(resultState.schemaVersion).to.equal(expectedState.schemaVersion);
        expect(resultState.addedProperty).to.equal(expectedState.addedProperty);
        expect(resultState.removedProperty).to.be.undefined;
    });
});