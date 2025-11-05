import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HSC({ navigation }: Props) {
  const games = [
    {
      title: 'DREAM SURVIVORS',
      route: 'Game4',
      description: '캠퍼스의 악몽을 DREAM의 정책으로 극복해보세요',
      details: [
        {
          label: '① 어떤 게임인지',
          text: '"Vampire Survivors" 스타일의 생존형 슈터 게임으로, 캠퍼스의 악몽을 DREAM의 정책으로 극복해 나갑니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '조이스틱으로 캐릭터를 조작하면 자동으로 공격이 발사됩니다. 적을 처치해 경험치를 얻고, 레벨업 시 정책 업그레이드를 선택합니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '모든 웨이브를 버텨서 보스를 전부 처치하면 클리어, 체력이 0이 되면 게임 오버가 됩니다.'
        },
      ],
    },
    {
      title: '정책 OX 퀴즈',
      route: 'Game5',
      description: 'OX퀴즈를 통해서 DREAM의 정책들을 체크해보세요',
      details: [
        {
          label: '① 어떤 게임인지',
          text: 'DREAM의 정책 내용을 기반으로 진행되는 OX 형식의 퀴즈 게임입니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '정책 문장을 읽고 사실이라 생각되면 O, 아니라면 X를 선택합니다. 연속으로 정답을 맞히면 콤보가 상승합니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '모든 문제를 풀거나 시간이 다 지나면 결과창이 나타나며, 틀린 정책이 표시되고 그에 대한 올바른 설명이 나옵니다.'
        },
      ],
    },
    {
      title: 'DREAM 제휴사 폭탄게임',
      route: 'Game1',
      description: 'DREAM의 어떤 제휴와 헤택이 있는지 맞춰보세요',
      details: [
        {
          label: '① 어떤 게임인지',
          text: 'DREAM의 제휴업체를 맞히며 폭탄을 피하는 긴장감 있는 단어 퀴즈 게임입니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '화면에 제시된 글자 버튼을 눌러 정답 단어를 완성합니다. 오답을 입력하면 폭탄이 터지며 기회가 줄어듭니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '모든 폭탄이 폭발하면 게임이 종료되고, 정답을 맞히면 제휴 단어가 완성되며 점수가 올라갑니다.'
        },
      ],
    },
    {
      title: '오늘 뭐 먹지?',
      route: 'Game3',
      description: '식사 고민일 때 DREAM의 수많은 제휴 중 하나 추천해드립니다.',
      details: [
        {
          label: '① 어떤 게임인지',
          text: 'DREAM의 제휴 음식점을 기반으로 메뉴를 추천받는 인터랙티브 추천 게임입니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '음식 종류나 몇 명인지 등의 카테고리를 선택한 뒤 추천받기 버튼을 누릅니다. 그에 맞는 DREAM 제휴 매장이 제안됩니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '결과창에 추천된 음식과 제휴 매장이 함께 표시되며, 다시 추천을 눌러 새로운 결과를 받아볼 수도 있습니다.'
        },
      ],
    },
    {
      title: 'DREAM 로고 퍼즐',
      route: 'Game2',
      description: '슬라이드 퍼즐을 동해서 DREAM의 로고를 맞춰보세요',
      details: [
        {
          label: '① 어떤 게임인지',
          text: 'DREAM의 상징 로고를 완성시키는 슬라이딩 퍼즐 게임입니다. 섞여버린 로고 조각들을 제자리에 맞추며 DREAM의 정체성을 되찾는 과정이 담겨 있습니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '화면 속 조각들을 클릭하거나 터치하여 빈 칸으로 이동시킵니다. 조각의 순서를 기억하고, 머릿속에서 로고의 전체 구도를 상상하며 맞춰 나가면 됩니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '모든 조각이 올바른 위치에 놓이면 DREAM 로고가 완성되고, 성공 메시지와 함께 완성된 로고가 화면에 나타납니다.'
        },
      ],
    },
    {
      title: '길건너 길건너',
      route: 'Game7',
      description: '학교의 불편 사항을 피해서 등교를 해보세요.',
      details: [
        {
          label: '① 어떤 게임인지',
          text: '"Crossy Road"처럼, 캠퍼스의 불편 요소를 피해 학교로 향하는 러닝 게임입니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '화살표 키나 터치 버튼을 이용해 학생 캐릭터를 조작합니다. 차량과 장애물을 피하며 앞으로 나아가야 합니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '차량에 부딪히면 즉시 게임 오버지만, 50점까지 도달하면 학교에 도착해 클리어됩니다.'
        },
      ],
    },
    {
      title: '드림 키우기',
      route: 'Game8',
      description: 'DREAM의 정책을 먹고 자라는 드림',
      details: [
        {
          label: '① 어떤 게임인지',
          text: '"드리미"가 캠퍼스 속에서 성장해 나가는 생존 게임입니다. F학점, 과제 폭탄, 팀플 잠수 등 캠퍼스 난관을 피하는 내용이 담겨 있습니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '마우스 또는 모바일 조이스틱으로 방향을 조절하며 먹이를 먹습니다. 몸집이 커질수록 조심스럽게 움직여야 합니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '머리가 다른 지렁이에 닿으면 탈락하며, 마지막 한 마리로 남으면 최종 승리입니다.'
        },
      ],
    },
    {
      title: '정책을 먹는 공룡',
      route: 'Game9',
      description: '정책을 먹으며 나만의 점수를 갱신 해보세요.',
      details: [
        {
          label: '① 어떤 게임인지',
          text: '공룡이 달리며 DREAM의 정책 코인을 모으는 러닝 액션 게임입니다. 각 코인은 DREAM의 정책 분야를 상징합니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '스페이스바(PC)나 화면 터치(모바일)로 점프하여 장애물을 피하고, 색색의 정책 코인을 모읍니다. 같은 색상의 코인을 2개 모으면 해당 정책 리스트가 공개됩니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '모든 정책 코인을 모으면 "모든 정책을 완성했어요!"라는 메시지와 함께 승리하며, 장애물에 닿으면 게임 오버로 종료됩니다.'
        },
      ],
    },
    {
      title: '드림 마리오 (출시 예정)',
      route: 'Game6',
      description: '제주대 캠퍼스를 모험하며 정책 아이콘을 찾는 클래식 플랫폼.',
      details: [
        {
          label: '① 어떤 게임인지',
          text: '"Super Mario Bros"의 감성을 그대로 살린 DREAM 캠퍼스 탐험 게임입니다. 플레이어는 제주대학교 캠퍼스를 배경으로 한 맵에서 달리고 점프하고 적을 밟으며 각 건물을 탐험하게 됩니다. 학교 주요 공간이 스테이지로 구성되어 있으며, 각 구역에는 DREAM의 상징적 아이콘과 정책이 숨겨져 있습니다.'
        },
        {
          label: '② 어떻게 하는지',
          text: '방향키로 이동하고, 스페이스바나 위쪽 화살표 키로 점프합니다. 달리기(Shift 키)를 누르면 속도가 증가하며, 길게 누를수록 높이 뛰는 점프 감각이 구현되어 있습니다. 스테이지 곳곳에 등장하는 굼바(Goomba)와 트루파(Troopa)는 피해 다니거나 밟아서 처치할 수 있습니다. 적을 밟으면 점수가 오르고, 코인을 모으면 추가 점수와 1UP 보너스를 얻습니다. 아이템을 획득하면 "빅 드리미" 상태로 파워업되어 공격을 한 번 버틸 수 있습니다.'
        },
        {
          label: '③ 어떻게 끝나는지',
          text: '플레이어가 구덩이에 떨어지거나 적과 충돌해 생명을 모두 잃으면 Game Over 화면이 나타납니다. 반대로 각 캠퍼스 구역의 끝까지 도달하거나 모든 주요 스테이지를 클리어하면 "캠퍼스 정복" 메시지와 함께 DREAM의 여정을 완수하게 됩니다. 각 스테이지를 클리어할 때마다 점수와 코인, 탐험한 건물이 기록되며, 전체 캠퍼스를 탐험하면 엔딩 크레딧이 표시됩니다.'
        },
      ],
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const selectedGame = games[selectedIndex];

  const handleUp = () => {
    if (isModalVisible) {
      return;
    }
    setSelectedIndex((prev) => {
      const newIndex = prev === 0 ? games.length - 1 : prev - 1;
      scrollRef.current?.scrollTo({ y: newIndex * 50, animated: true });
      return newIndex;
    });
  };

  const handleDown = () => {
    if (isModalVisible) {
      return;
    }
    setSelectedIndex((prev) => {
      const newIndex = prev === games.length - 1 ? 0 : prev + 1;
      scrollRef.current?.scrollTo({ y: newIndex * 50, animated: true });
      return newIndex;
    });
  };

  const handleLaunchGame = () => {
    const game = games[selectedIndex];
    setModalVisible(false);
    navigation.navigate(game.route);
  };

  const handleSelect = () => {
    if (isModalVisible) {
      handleLaunchGame();
      return;
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Keyboard navigation removed - use touch controls (D-pad and START button) instead

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Screen - Game Description */}
      <View style={styles.topScreen}>
        <View style={styles.topLabelBar}>
          <View style={styles.topLabelStripe} />
          <Text style={styles.topLabelText}>GAME INFO</Text>
        </View>
        <View style={styles.topScreenInner}>
          <Text style={styles.gameTitle}>{selectedGame.title}</Text>
          <Text style={styles.gameDescription}>{selectedGame.description}</Text>
        </View>
      </View>

      {/* Bottom Screen - Game Selection */}
      <View style={styles.bottomScreen}>
        <View style={styles.topLabelBar}>
          <View style={styles.topLabelStripe} />
          <Text style={styles.topLabelText}>SELECT GAME</Text>
        </View>

        {/* Inner LCD */}
        <View style={styles.screenInner}>
          <ScrollView
            ref={scrollRef}
            scrollEnabled={false}
            style={styles.gameMenu}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {games.map((g, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.gameButton, i === selectedIndex && styles.gameButtonSelected]}
                onPress={() => {
                  setSelectedIndex(i);
                  setModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.gameButtonText, i === selectedIndex && styles.gameButtonTextSelected]}>
                  {g.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlRow}>
        <View style={styles.dpad}>
          <View style={styles.dpadBackground}>
            <View style={styles.dpadVertical} />
            <View style={styles.dpadHorizontalBar} />
          </View>
          <TouchableOpacity
            style={styles.dpadUp}
            onPress={handleUp}
            activeOpacity={0.7}
          >
            <Text style={styles.dpadIcon}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dpadDown}
            onPress={handleDown}
            activeOpacity={0.7}
          >
            <Text style={styles.dpadIcon}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dpadLeft} disabled activeOpacity={0.7}>
            <Text style={styles.dpadIcon}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dpadRight} disabled activeOpacity={0.7}>
            <Text style={styles.dpadIcon}>▶</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.startButtonWrapper}>
          <TouchableOpacity style={styles.startButton} onPress={handleSelect} activeOpacity={0.9}>
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logo */}
      <Image
        source={require('../../assets/logo2.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <Text style={styles.footerText}>제주대학교 58대 DREAM 총학생회 선거운동본부</Text>

      {/* Speaker grille */}
      <View style={styles.speaker}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.speakerLine} />
        ))}
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedGame.title}</Text>
            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={styles.modalContentInner}
              showsVerticalScrollIndicator={false}
            >
              {selectedGame.details?.map((section, index) => (
                <View key={index} style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>{section.label}</Text>
                  <Text style={styles.modalSectionText}>{section.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSecondaryButton]}
                onPress={handleCloseModal}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, styles.modalSecondaryButtonText]}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimaryButton]}
                onPress={handleLaunchGame}
                activeOpacity={0.9}
              >
                <Text style={[styles.modalButtonText, styles.modalPrimaryButtonText]}>게임 실행</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7EC8C8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
  },
  body: {},
  topScreen: {
    width: '90%',
    height: '28%',
    backgroundColor: '#6e6d73',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  bottomScreen: {
    width: '90%',
    height: '36%',
    backgroundColor: '#6e6d73',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  topScreenInner: {
    flex: 1,
    marginTop: 24,
    backgroundColor: '#B0F0E8',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#306230',
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  gameTitle: {
    fontFamily: 'DungGeunMo',
    fontSize: 20,
    color: '#0f380f',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
    fontWeight: '400',
  },
  gameDescription: {
    fontFamily: 'DungGeunMo',
    fontSize: 13,
    color: '#0f380f',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  screenOuter: {
    width: '88%',
    height: '45%',
    backgroundColor: '#6e6d73', // bezel color
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  topLabelBar: {
    position: 'absolute',
    top: 6,
    left: 12,
    right: 12,
    height: 22,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLabelStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    backgroundColor: '#b0297b',
  },
  topLabelText: {
    fontFamily: 'DungGeunMo',
    fontSize: 9,
    color: '#e5e5e8',
    opacity: 0.9,
    fontWeight: '400',
  },
  batteryBlock: {
    position: 'absolute',
    left: 18,
    top: 40,
    alignItems: 'center',
    gap: 4,
  },
  batteryLed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e10000',
    shadowColor: '#900',
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  batteryText: {
    fontFamily: 'DungGeunMo',
    fontSize: 9,
    color: '#d7d6d1',
    opacity: 0.9,
    fontWeight: '400',
  },
  screenInner: {
    flex: 1,
    marginTop: 24,
    backgroundColor: '#B0F0E8',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#306230',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  logoImage: {
    width: 140,
    height: 28,
    marginTop: 8,
    marginBottom: 10,
    tintColor: '#ffffff',
  },
  gbLogo: {
    marginTop: 8,
    fontFamily: 'DungGeunMo',
    fontSize: 13,
    color: '#2a3c8a',
    fontWeight: '400',
  },
  gbLogoNintendo: {
    color: '#2a3c8a',
    fontWeight: '700',
  },
  gameMenu: {
    marginTop: 4,
    width: '100%',
    paddingHorizontal: 0,
  },
  scrollContent: {
    alignItems: 'stretch',
    paddingBottom: 10,
  },
  gameButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 4,
    paddingVertical: 14,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  gameButtonSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  gameButtonText: {
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'DungGeunMo',
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 22,
    fontWeight: '400',
  },
  gameButtonTextSelected: {
    color: '#000000',
    fontWeight: '700',
  },
  controlRow: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    bottom: '6%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  // D-pad styles
  dpad: {
    position: 'relative',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadVertical: {
    position: 'absolute',
    width: 46,
    height: 120,
    backgroundColor: '#2c2f39',
    borderRadius: 8,
  },
  dpadHorizontalBar: {
    position: 'absolute',
    width: 120,
    height: 46,
    backgroundColor: '#2c2f39',
    borderRadius: 8,
  },
  dpadUp: {
    position: 'absolute',
    top: 8,
    width: 46,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dpadDown: {
    position: 'absolute',
    bottom: 8,
    width: 46,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dpadLeft: {
    position: 'absolute',
    left: 8,
    width: 35,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dpadRight: {
    position: 'absolute',
    right: 8,
    width: 35,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dpadIcon: {
    color: '#e7e9f0',
    fontSize: 20,
    fontWeight: '700',
  },
  // START button styles
  startButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    width: 128,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2c2f39',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#3a3d49',
  },
  startButtonText: {
    color: '#e7e9f0',
    fontSize: 15,
    fontFamily: 'DungGeunMo',
    fontWeight: '600',
    letterSpacing: 1,
  },
  // Speaker
  speaker: {
    position: 'absolute',
    right: '8%',
    bottom: '2%',
    flexDirection: 'row',
    gap: 4,
  },
  speakerLine: {
    width: 2,
    height: 14,
    backgroundColor: '#2a3c8a',
    opacity: 0.3,
    transform: [{ rotate: '-25deg' }],
  },
  footerText: {
    marginTop: -4,
    textAlign: 'center',
    fontFamily: 'DungGeunMo',
    fontSize: 10,
    color: '#2c2f39',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: '#fefefe',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#2c2f39',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  modalTitle: {
    fontFamily: 'DungGeunMo',
    fontSize: 20,
    color: '#1b1d21',
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalContent: {
    marginTop: 18,
  },
  modalContentInner: {
    paddingBottom: 8,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionLabel: {
    fontFamily: 'DungGeunMo',
    fontSize: 14,
    color: '#2c2f39',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  modalSectionText: {
    fontFamily: 'DungGeunMo',
    fontSize: 13,
    color: '#2c2f39',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2c2f39',
  },
  modalButtonText: {
    fontFamily: 'DungGeunMo',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  modalPrimaryButton: {
    backgroundColor: '#2c2f39',
  },
  modalPrimaryButtonText: {
    color: '#f5f7fa',
  },
  modalSecondaryButton: {
    backgroundColor: '#ffffff',
  },
  modalSecondaryButtonText: {
    color: '#2c2f39',
  },
});
