declare module "rn-toaster" {
  import { ViewStyle, TextStyle } from "react-native";
  import { Component } from "react";

  interface ToasterProps {
    // the style will pass to the Toast container view
    style?: ViewStyle;
    // the style will pass to the Toast text component
    textStyle?: TextStyle;

    //determine the top or bottom spacing when the position is on the top or bottom
    // default : 30
    spacing?: Number;

    //	determine the position of toast
    // default : bottom
    position?: Gravity;

    // determine the residence duration after toast is shown
    // default: 3000
    duration?: Number;

    // determine the duration of toast animation
    // default: 510
    animatedDuration?: Number;

    //	determine the delay of toast animation
    delay?: Number;

    //determine the marginTop of the root container view, it is used when toast's position is constants.top
    // default: 0
    marginTop?: Number;
  }
  enum Gravity {
    bottom = 0,
    top = 1,
    center = 2
  }

  interface ShowProps {
    children?: JSX.Element;
    position?: Gravity;
    duration?: Number;
    easing?: any;
    delay?: Number;
    animationEnd?: Number;
  }

  interface HideProps {
    duration?: Number;
    easing?: any;
    delay?: Number;
    animationEnd?: Number;
  }

  export default class Toast extends Component<ToasterProps, any> {
    static show(props: ShowProps);
    static hide(props: HideProps);
  }
}
