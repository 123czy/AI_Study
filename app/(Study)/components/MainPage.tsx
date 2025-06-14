import styles from '../Main/page.module.css'

const MainPage = () => {
  return (
    <div className='flex flex-col gap-12 mb-12'>
      <div className='min-h-[500px] flex flex-col sm:flex-row justify-between items-center gap-6 '>
          <div className='w-full sm:w-1/2 flex flex-col justify-center items-center sm:items-start'>
              <h1 className='text-4xl sm:text-6xl font-bold text-primary mb-6'>AI英语学习助手</h1>
              <p className='text-2xl font-bold text-gray-500 mb-4'>AI驱动的英语学习体验</p>
              <p className='text-2xl text-gray-500 mb-4'>通过AI技术，帮助你提高英语水平</p>
          </div>
          <div className='w-full sm:w-1/2'>
            <div className={styles.heroGraphic}>
              <svg className={styles.blob} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#2563EB" d="M45.7,-58.9C59.9,-51.4,72.5,-38.6,77.7,-23.1C82.9,-7.6,80.8,10.6,73.1,25.9C65.4,41.2,52.1,53.6,37.4,60.9C22.7,68.2,6.6,70.3,-8.6,67.9C-23.8,65.5,-38.1,58.5,-50.5,48.1C-62.9,37.7,-73.4,23.8,-76.3,8.1C-79.2,-7.6,-74.5,-25.1,-64.2,-37.8C-53.9,-50.5,-38,-58.4,-23,-62.7C-8,-67,-4,-67.7,6.3,-66.1C16.6,-64.5,31.5,-66.5,45.7,-58.9Z" transform="translate(100 100)" />
              </svg>
              <div className={styles.iconGrid}>
                  <div className={`${styles.icon} ${styles.iconFloat1}`}>🎯</div>
                  <div className={`${styles.icon} ${styles.iconFloat2}`}>🗣️</div>
                  <div className={`${styles.icon} ${styles.iconFloat3}`}>🎓</div>
                  <div className={`${styles.icon} ${styles.iconFloat4}`}>🔊</div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default MainPage