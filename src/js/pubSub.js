//Stores arrays of listeners for channels.
const channels = new Map()

//Stores maps of arrays of listerns for events on channels.
const channelEvents = new Map()

/**
 *   Subscribe to a channel.
 *
 *   @param  {string}   channel    - Channel identifier
 *   @param  {function} callback   - Function call upon event.
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
 *   @param  {Object} event   - THe event.
 */
const emit = (channel, event) => {

    //Check if there is anyone listening.
    if (!channels.has(channel)) {
        return false
    }

    channels.get(channel).forEach(subscription => {
        if (subscription) {
            subscription(event)
        }
    })
}

module.exports = {
	emit,
	subscribe
}
