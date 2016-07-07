//Stores arrays of listeners for channels.
const channels = new Map()

//Stores maps of arrays of listerns for events on channels.
const channelEvents = new Map()

/**
 *   Subscribe to a channel.
 *
 *   @param  {string}   channel    - Channel identifier
 *   @param  {function} [callback] - Function call upon event.
 */
const subscribe = (channel, callback) => {

    //Check if channel already exists.
    if (!channels.has(channel)) {
        channels.set(channel, [])
        channelEvents.set(channel, new Map())
    }

    //Save the new callback.
    channels.get(channel).push(callback)
}

/**
 *   Emit something over a channel.
 *
 *   @param  {string} channel - Channel identifier.
 *   @param  {string} [event] - Event identifier.
 *   @param  {...any} extras  - Any extra parammeters to emit.
 */
const emit = (channel, event) => {

    //Check if there is anyone listening.
    if (!channels.has(channel)) {
        return false
    }

    //Send the message, that is to say all extra arguments.
    let allArgs = Array.prototype.slice.call(arguments, 1);
    channels.get(channel).forEach(subscription => {
        if (subscription) {
            subscription(...allArgs)
        }
    })
}

module.exports = {
	emit,
	subscribe
}
