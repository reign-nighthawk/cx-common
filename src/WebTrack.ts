/**
 * @Description 网页埋点SDK
 * @Author tangchenxu
 * @CreateDate 2020/06/23
 */
const WebTrack = {
  init: () => {
    console.log(`%cWebTrack Load`, 'color:#2ECC71')
    window.addEventListener('hashchange', function (event) {
      console.log(event)
    })
  },
}
export default WebTrack
