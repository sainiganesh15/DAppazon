import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {


  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);

  const [account, setAccount] = useState(null); // useState gonna return an array of two things the account itself account is null setAccount will set the account

  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)
  
  
 
  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

   // way to retrieve the accounts the accounts from metamask
    const loadBlockchainData = async () => {
    //connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log(network)

    //connect to smart contracts (Create JS Version)
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon.address,
      Dappazon,
      provider
    )
    setDappazon(dappazon)


    //Load products

    const item = []

    for(var i = 0; i < 9; i++){
      const item = await dappazon.items(i + 1)
      item.push(item)
    }
    
    const electronics = item.filter((item) => item.category === 'electronics')  // filter is an function inside the javascript to filter an array
    const clothing = item.filter((item) => item.category === 'clothing')
    const toys = item.filter((item) => item.category === 'toys')

    setElectronics(electronics)
    setClothing(clothing)
    setToys(toys)
  
  }




useEffect(() => {       // it is a hook from react and it work is to call the function when a component is rendered on the page 
  loadBlockchainData()
}, [])

 return(
  <div>
    <Navigation account={account} setAccount={setAccount} />

    <h2>Dappazon Best Seller</h2>
    <div>
    {electronics && clothing && toys &&( 
      <>
      <Section id="mySection" title={"Clothing & Jewellery"} items={clothing} togglePop={togglePop} />

      <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
      <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
      </>
    )}</div>
    
    {toggle && (
    <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop}/>
    )}
    
    
  </div>
);
}




    
export default App;
