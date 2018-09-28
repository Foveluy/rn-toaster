/*
 * A android like toast for android and ios, written in JS
 * Released under the MIT license
 * Copyright (c) 2018 ZhengFang
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  ViewPropTypes
} from "react-native";

import TimerEnhance from "react-native-smart-timer-enhance";
import constants, { gravity } from "./constants";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "absolute",
    borderRadius: 8,
    padding: 8,
    left: -9999,
    zIndex: 999
  },
  text: {
    fontFamily: ".HelveticaNeueInterface-MediumP4",
    fontSize: 14,
    color: "#fff"
  }
});

class Toast extends Component {
  static constants = constants;

  static defaultProps = {
    spacing: 30,
    position: gravity.bottom,
    duration: 3000,
    animatedDuration: 510,
    delay: 0,
    marginTop: 0
  };

  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    spacing: PropTypes.number,
    position: PropTypes.oneOf([gravity.top, gravity.bottom, gravity.center]),
    duration: PropTypes.number,
    animatedDuration: PropTypes.number,
    delay: PropTypes.number,
    marginTop: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      position: props.position,
      visible: false,
      top: new Animated.Value(-100),
      children: props.children
    };
    this._toastWidth = null;
    this._toastHeight = null;
    this._toastShowAnimation = null;
    this._toastHideAnimation = null;
    this._toastAnimationToggle = null;
  }

  render() {
    let children = React.Children.map(this.state.children, child => {
      if (!React.isValidElement(child)) {
        return <Text style={[styles.text, this.props.textStyle]}>{child}</Text>;
      }
      return child;
    });
    return this.state.visible ? (
      <Animated.View
        ref={component => (this._container = component)}
        onLayout={this._onToastLayout}
        style={[styles.container, this.props.style, { top: this.state.top }]}
      >
        {children}
      </Animated.View>
    ) : null;
  }

  show(
    {
      children = this.state.children,
      position = this.state.position,
      duration = this.props.animatedDuration,
      easing = Easing.linear,
      delay = this.props.delay,
      animationEnd,
      toValue = 100
    } = {
      children: this.state.children,
      position: this.state.position,
      duration: this.props.animatedDuration,
      easing: Easing.linear,
      delay: this.props.delay
    }
  ) {
    this._toastShowAnimation && this._toastShowAnimation.stop();
    this._toastHideAnimation && this._toastHideAnimation.stop();
    this._toastAnimationToggle && this.clearTimeout(this._toastAnimationToggle);

    if (this.state.visible) {
      this._setToastPosition(position);
    }

    this.setState({
      children,
      position,
      visible: true
    });

    this._toastShowAnimation = Animated.spring(this.state.top, {
      toValue: toValue,
      duration,
      easing,
      delay,
      tension: 30
    });
    this._toastShowAnimation.start(() => {
      this._toastShowAnimation = null;
      if (!animationEnd) {
        this._toastAnimationToggle = this.setTimeout(() => {
          this.hide({ duration, easing, delay, toValue: -toValue });
          this._toastAnimationToggle = null;
        }, this.props.duration);
      } else {
        animationEnd();
      }
    });
  }

  hide(
    {
      duration = this.props.animatedDuration,
      easing = Easing.linear,
      delay = this.props.delay,
      animationEnd,
      toValue = 0
    } = {
      duration: this.props.animatedDuration,
      easing: Easing.linear,
      delay: this.props.delay
    }
  ) {
    this._toastShowAnimation && this._toastShowAnimation.stop();
    this._toastHideAnimation && this._toastHideAnimation.stop();
    this.clearTimeout(this._toastAnimationToggle);

    this._toastHideAnimation = Animated.spring(this.state.top, {
      toValue: toValue,
      duration,
      easing,
      delay
    });
    this._toastHideAnimation.start(() => {
      this._toastHideAnimation = null;
      this.setState({
        visible: false
      });
      animationEnd && animationEnd();
    });
  }

  _onToastLayout = e => {
    this._toastWidth = e.nativeEvent.layout.width;
    this._toastHeight = e.nativeEvent.layout.height;
    this._setToastPosition();
  };

  _setToastPosition(position = this.state.position) {
    if (!this._toastWidth || !this._toastHeight) {
      return;
    }
    let { spacing, marginTop } = this.props;
    let left = (deviceWidth - this._toastWidth) / 2;
    let top =
      position == gravity.top
        ? spacing + marginTop
        : position == gravity.center
          ? (deviceHeight - this._toastHeight) / 2
          : null;
    let bottom = position == gravity.bottom ? spacing : null;
    this._container.setNativeProps({
      style: {
        left,
        top,
        bottom
      }
    });
  }
}

export default TimerEnhance(Toast);
