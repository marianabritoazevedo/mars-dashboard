let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    roverSelected: 'none',
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = store.merge(newState);
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    const rovers = state.get('rovers'); 
    const apod = state.get('apod'); 
    const user = state.get('user'); 
    const roverSelected = state.get('roverSelected')

    if(roverSelected == "none"){
        return `
        <header class="header">
            ${Menu(rovers)}
        </header>
        <main>
            ${Greeting(user)}
            <section>
                <h3 class="mb-2">Immersive experience on Mars</h3>
                <p>
                Explore space with our amazing interactive panel! Choose the rover you prefer from the menu above and dive into the 
                latest images and information about its mission. Simply select <b>Curiosity</b>, <b>Opportunity</b>, or <b>Spirit</b>, and embark on 
                this adventure through the cosmos!
                </p>
            </section>
        </main>
        <footer></footer>
    `
    }else{
        return `
            <header class="header">
                ${Menu(rovers)}
            </header>
            <main>
                ${Greeting(user)}
                <section>
                    <h3 class="mb-2">Immersive experience on Mars - More about rover ${roverSelected}!</h3>
                    <p>
                    Information about ${roverSelected}
                    ${getRoverImages(roverSelected)}
                    </p>
                </section>
            </main>
            <footer></footer>
        `
    }
    
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (user) => {
    const name = user.get('name')
    if (name) {
        return `
            <h1 class='text-center mt-5'>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const Menu = (rovers) => {
    const itemsMenu = rovers.map(rover => {
        return `<li class="nav-item mr-3" onclick="selectRover('${rover}')">${rover}</li>`;
    }).join(" ");

    return `
        <nav class="navbar navbar-expand-xl fixed-top py-3" style="background-color: #4895c2">
            <div class="container">
                <h4> Mars Dashboard - Udacity </h4>
                <button type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler navbar-toggler-right"><i class="fa fa-bars" style="color: #f2f1eb"></i></button>
                <div id="navbarSupportedContent" class="collapse navbar-collapse">
                    <ul class="navbar-nav ml-auto">
                        ${itemsMenu}                    
                    </ul>
                </div>
            </div>
        </nav>
    `
}

const selectRover = (rover) => {
    const newState = store.set('roverSelected', rover);
    updateStore(store, newState);
}

// // Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = (apod) => {

//     // If image does not already exist, or it is not from today -- request it again
//     const today = new Date()
//     const photodate = new Date(apod.date)
//     console.log(photodate.getDate(), today.getDate());

//     console.log(photodate.getDate() === today.getDate());
//     if (!apod || apod.date === today.getDate() ) {
//         getImageOfTheDay(store)
//     }

//     // check if the photo of the day is actually type video!
//     if (apod.media_type === "video") {
//         return (`
//             <p>See today's featured video <a href="${apod.url}">here</a></p>
//             <p>${apod.title}</p>
//             <p>${apod.explanation}</p>
//         `)
//     } else {
//         return (`
//             <img src="${apod.image.url}" height="350px" width="100%" />
//             <p>${apod.image.explanation}</p>
//         `)
//     }
// }

// ------------------------------------------------------  API CALLS

// Verificar como fazer isso funcionar
const getRoverImages = async (roverName) => {
    try {
        const response = await fetch(`/rovers/${roverName}`); // Requisição para a rota '/rovers/:name'
        const data = await response.json();
        const photos = data.latest_photos;
        const infoRover = organizeRoverImages(photos)
        //const onePic = photos.slice(0, 1)[0];
        //const newState = store.set('apod', onePic)
        //console.log(store.get('roverSelected'))
        //updateStore(store, newState)
        console.log(infoRover)
        return infoRover;
        //return onePic;
    } catch (error) {
        console.error('Erro ao buscar imagens do rover:', error);
        throw error;
    }
}

const organizeRoverImages = (photos) => {
    const onePic = photos.slice(0, 1)[0];
    const image_url = onePic.img_src;
    console.log(image_url)
    return `
    <div>
        <img src="${image_url}">
    </div>
    `
}

// // Example API call
// const getImageOfTheDay = (state) => {
//     let { apod } = state

//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, { apod }))

//     return data
//     // let { apod } = state;
//     // const response = await fetch(`http://localhost:3000/apod`)
//     // apod = await response.json() // get data from the promise returned by .json()
//     // const newState = store.set('apod', apod);
//     // updateStore(store, newState)
//     // return apod;
// }
