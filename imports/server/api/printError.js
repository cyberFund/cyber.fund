export default function printError(label, e){
  console.log(`--- error ${label}`)
  console.error(e)
  console.log('... ')
  console.log()
}
