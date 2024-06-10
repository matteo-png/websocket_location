document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  let map;
  let markers = {};

  document.getElementById("register").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    if (!name) return alert("Please enter a name");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const user = {
          id: socket.id,
          name: name,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        socket.emit("register", user);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });

  socket.on("update-users", (users) => {
    updateUsersList(users);
    updateMarkers(users);
  });

  function updateUsersList(users) {
    const userList = document.getElementById("users");
    userList.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = `${user.name} (Lat: ${user.location.lat}, Lng: ${user.location.lng})`;
      userList.appendChild(li);
    });
  }

  function updateMarkers(users) {
    Object.values(markers).forEach((marker) => marker.setMap(null));
    markers = {};

    users.forEach((user) => {
      const latLng = new google.maps.LatLng(
        user.location.lat,
        user.location.lng
      );
      const marker = new google.maps.Marker({ position: latLng, map: map });
      markers[user.id] = marker;
    });
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 0, lng: 0 },
      zoom: 2,
    });
  }

  window.onload = initMap;
});
