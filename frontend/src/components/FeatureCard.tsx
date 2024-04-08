import './FeatureCard.css'
const FeatureCard = ({title , description} : {title : string , description : string}) => {
  return (
    <div className='card-container'>
        <h3 className='card-title'>{title}</h3>
        <p className='card-description'>{description}</p>
    </div>
  )
}

export default FeatureCard