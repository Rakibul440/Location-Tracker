const socket = io()
const markers = {}

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        socket.emit('send-location',{latitude,longitude}); // send data to  backend
    },(error)=>{
       console.error("Error : ",error)
    },{
        enableHighAccuracy : true,
        timeout: 5000,
        maximumAge : 0
    })
}
const map = L.map("map").setView([0,0],10)

socket.on('receive-locaiton',(data)=>{// receive data from backend
    const {id,latitude,longitude} = data
    map.setView([latitude,longitude],10)
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map)
    }
    console.log(data);
    
}) 

socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution : "Rakibul Islam"
}).addTo(map)