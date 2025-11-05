// 로컬 이미지 매핑
export const IMAGE_MAP: Record<string, any> = {
  // 실제 파일 매핑
  'require(\'../assets/list_images/1.png\')': require('../assets/list_images/1.png'),
  'require(\'../assets/list_images/2.png\')': require('../assets/list_images/2.png'),
  'require(\'../assets/list_images/3.jpeg\')': require('../assets/list_images/3.jpeg'),
  'require(\'../assets/list_images/4.jpg\')': require('../assets/list_images/4.jpg'),
  'require(\'../assets/list_images/5.png\')': require('../assets/list_images/5.png'),
  'require(\'../assets/list_images/6.png\')': require('../assets/list_images/6.png'),
  'require(\'../assets/list_images/7.png\')': require('../assets/list_images/7.png'),
  'require(\'../assets/list_images/8.png\')': require('../assets/list_images/8.png'),
  'require(\'../assets/list_images/9.png\')': require('../assets/list_images/9.png'),
  'require(\'../assets/list_images/10.jpg\')': require('../assets/list_images/10.jpg'),
  'require(\'../assets/list_images/11.png\')': require('../assets/list_images/11.png'),
  'require(\'../assets/list_images/12.png\')': require('../assets/list_images/12.png'),
  'require(\'../assets/list_images/13.jpg\')': require('../assets/list_images/13.jpg'),
  'require(\'../assets/list_images/14.png\')': require('../assets/list_images/14.png'),
  'require(\'../assets/list_images/15.png\')': require('../assets/list_images/15.png'),
  'require(\'../assets/list_images/16.png\')': require('../assets/list_images/16.png'),
  'require(\'../assets/list_images/17.png\')': require('../assets/list_images/17.png'),
  'require(\'../assets/list_images/18.jpeg\')': require('../assets/list_images/18.jpeg'),
  'require(\'../assets/list_images/19.png\')': require('../assets/list_images/19.png'),
  'require(\'../assets/list_images/20.png\')': require('../assets/list_images/20.png'),
  'require(\'../assets/list_images/21.png\')': require('../assets/list_images/21.png'),
  'require(\'../assets/list_images/22.png\')': require('../assets/list_images/22.png'),
  'require(\'../assets/list_images/23.png\')': require('../assets/list_images/23.png'),
  'require(\'../assets/list_images/24.jpg\')': require('../assets/list_images/24.jpg'),
  'require(\'../assets/list_images/26.jpeg\')': require('../assets/list_images/26.jpeg'),
  'require(\'../assets/list_images/27.jpeg\')': require('../assets/list_images/27.jpeg'),
  'require(\'../assets/list_images/30.png\')': require('../assets/list_images/30.png'),
  'require(\'../assets/list_images/31.jpg\')': require('../assets/list_images/31.jpg'),
  'require(\'../assets/list_images/32.png\')': require('../assets/list_images/32.png'),
  'require(\'../assets/list_images/33.jpg\')': require('../assets/list_images/33.jpg'),
  'require(\'../assets/list_images/34.png\')': require('../assets/list_images/34.png'),
  'require(\'../assets/list_images/36.png\')': require('../assets/list_images/36.png'),
  'require(\'../assets/list_images/37.jpg\')': require('../assets/list_images/37.jpg'),

  // JSON에 잘못된 확장자로 저장된 경우 대응
  'require(\'../assets/list_images/13.png\')': require('../assets/list_images/13.jpg'),
  'require(\'../assets/list_images/17.jpeg\')': require('../assets/list_images/17.png'),
  'require(\'../assets/list_images/18.png\')': require('../assets/list_images/18.jpeg'),
  'require(\'../assets/list_images/23.jpg\')': require('../assets/list_images/23.png'),
  'require(\'../assets/list_images/24.jpeg\')': require('../assets/list_images/24.jpg'),
  'require(\'../assets/list_images/27.jpg\')': require('../assets/list_images/27.jpeg'),
  'require(\'../assets/list_images/30.jpg\')': require('../assets/list_images/30.png'),
  'require(\'../assets/list_images/31.png\')': require('../assets/list_images/31.jpg'),
  'require(\'../assets/list_images/32.jpg\')': require('../assets/list_images/32.png'),
  'require(\'../assets/list_images/33.png\')': require('../assets/list_images/33.jpg'),
  'require(\'../assets/list_images/36.jpg\')': require('../assets/list_images/36.png'),
  'require(\'../assets/list_images/37.png\')': require('../assets/list_images/37.jpg'),
};

// 이미지 소스 가져오기 헬퍼 함수
export function getImageSource(imageString: string) {
  // URL인 경우
  if (imageString.startsWith('http://') || imageString.startsWith('https://')) {
    return { uri: imageString };
  }

  // 로컬 이미지인 경우
  if (IMAGE_MAP[imageString]) {
    return IMAGE_MAP[imageString];
  }

  // 매칭되지 않으면 null 반환
  return null;
}
