import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  Modal
} from 'react-native';

import Exponent from 'exponent';

import {
  createRouter,
  NavigationProvider,
  StackNavigation,
  withNavigation
} from '@exponent/ex-navigation';

import { GiftedForm, GiftedFormModal, GiftedFormManager } from 'react-native-gifted-form'

const Router = createRouter(() => ({
  home: () => HomeScreen,
}));

class App extends React.Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation initialRoute={Router.getRoute('home')} />
      </NavigationProvider>
    );
  }
}

@withNavigation
class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Home',
    }
  }

  state = {
    modalVisible: false,
    modalContent: <Text>Foo</Text>
  }

  setModalVisible(visible, params = null) {
    this.setState({
      modalVisible: visible, 
      modalContent: params !== null ? params.renderScene(null) : <Text>No content</Text> ,
      modalRight: params !== null ? params.renderRightButton(null) : <Text>No content</Text> ,
      modalTitle: <Text>{params !== null ? params.getTitle() : 'No title'}</Text>
    })
    
  }

  onModalClose() {
    console.log('modal close')
  }

  render() {
    return (
    <View style={{flex:1, flexDirection: 'column'}}>

      <GiftedForm
        formName='signupForm' // GiftedForm instances that use the same name will also share the same states

        openModal={(params) => {
          this.setModalVisible(true, params)
        }}

        closeModal={() => { this.setModalVisible(false) }}

        clearOnClose={false} // delete the values of the form when unmounted

        defaults={{
          /*
          username: 'Farid',
          'gender{M}': true,
          password: 'abcdefg',
          country: 'FR',
          birthday: new Date(((new Date()).getFullYear() - 18)+''),
          */
        }}

        validators={{
          fullName: {
            title: 'Full name',
            validate: [{
              validator: 'isLength',
              arguments: [1, 23],
              message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
            }]
          },
          username: {
            title: 'Username',
            validate: [{
              validator: 'isLength',
              arguments: [3, 16],
              message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
            },{
              validator: 'matches',
              arguments: /^[a-zA-Z0-9]*$/,
              message: '{TITLE} can contains only alphanumeric characters'
            }]
          },
          password: {
            title: 'Password',
            validate: [{
              validator: 'isLength',
              arguments: [6, 16],
              message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
            }]
          },
          emailAddress: {
            title: 'Email address',
            validate: [{
              validator: 'isLength',
              arguments: [6, 255],
            },{
              validator: 'isEmail',
            }]
          },
          bio: {
            title: 'Biography',
            validate: [{
              validator: 'isLength',
              arguments: [0, 512],
              message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
            }]
          },
          gender: {
            title: 'Gender',
            validate: [{
              validator: (...args) => {
                if (args[0] === undefined) {
                  return false;
                }
                return true;
              },
              message: '{TITLE} is required',
            }]
          },
          birthday: {
            title: 'Birthday',
          },
          country: {
            title: 'Country',
            validate: [{
              validator: 'isLength',
              arguments: [2],
              message: '{TITLE} is required'
            }]
          },
        }}
      >

        <GiftedForm.SeparatorWidget />
        <GiftedForm.TextInputWidget
          name='fullName' // mandatory
          title='Full name'

          image={require('./icons/color/user.png')}

          placeholder='Marco Polo'
          clearButtonMode='while-editing'
        />


        <GiftedForm.TextInputWidget
          name='username'
          title='Username'
          image={require('./icons/color/contact_card.png')}

          placeholder='MarcoPolo'
          clearButtonMode='while-editing'

          onTextInputFocus={(currentText = '') => {
            if (!currentText) {
              let fullName = GiftedFormManager.getValue('signupForm', 'fullName');
              if (fullName) {
                return fullName.replace(/[^a-zA-Z0-9-_]/g, '');
              }
            }
            return currentText;
          }}
        />

        <GiftedForm.TextInputWidget
          name='password' // mandatory
          title='Password'

          placeholder='******'


          clearButtonMode='while-editing'
          secureTextEntry={true}
          image={require('./icons/color/lock.png')}
        />

        <GiftedForm.TextInputWidget
          name='emailAddress' // mandatory
          title='Email address'
          placeholder='example@nomads.ly'

          keyboardType='email-address'

          clearButtonMode='while-editing'

          image={require('./icons/color/email.png')}
        />

        <GiftedForm.SeparatorWidget />

        <GiftedForm.ModalWidget
          title='Gender'
          displayValue='gender'
          image={require('./icons/color/gender.png')}
        >
          <GiftedForm.SeparatorWidget />

          <GiftedForm.SelectWidget name='gender' title='Gender' multiple={false}>
            <GiftedForm.OptionWidget image={require('./icons/color/female.png')} title='Female' value='F'/>
            <GiftedForm.OptionWidget image={require('./icons/color/male.png')} title='Male' value='M'/>
          </GiftedForm.SelectWidget>
        </GiftedForm.ModalWidget>

        <GiftedForm.ModalWidget
          title='Birthday'
          displayValue='birthday'
          image={require('./icons/color/birthday.png')}

          scrollEnabled={false}
        >
          <GiftedForm.SeparatorWidget/>
          <GiftedForm.DatePickerIOSWidget
            name='birthday'
            mode='date'

            getDefaultDate={() => {
              return new Date(((new Date()).getFullYear() - 18)+'');
            }}
          />
        </GiftedForm.ModalWidget>
        <GiftedForm.ModalWidget
          title='Country'
          displayValue='country'
          image={require('./icons/color/passport.png')}
          scrollEnabled={false}

        >
          <GiftedForm.SelectCountryWidget 
            code='alpha2' 
            name='country' 
            title='Country' 
            autoFocus={true}
          />
        </GiftedForm.ModalWidget>


        <GiftedForm.ModalWidget
          title='Biography'
          displayValue='bio'

          image={require('./icons/color/book.png')}

          scrollEnabled={true} // true by default
        >
          <GiftedForm.SeparatorWidget/>
          <GiftedForm.TextAreaWidget
            name='bio'

            autoFocus={true}

            placeholder='Something interesting about yourself'
          />
        </GiftedForm.ModalWidget>



        <GiftedForm.SubmitWidget
          title='Sign up'
          widgetStyles={{
            submitButton: {
              backgroundColor: '#000',
            }
          }}
          onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
            if (isValid === true) {
              // prepare object
              values.gender = values.gender[0];

              /* Implement the request to your server using values variable
              ** then you can do:
              ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
              ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
              ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
              */
              
              postSubmit();
            }
          }}

        />

        <GiftedForm.NoticeWidget 
          title='By signing up, you agree to the Terms of Service and Privacy Policity.'
        />

        <GiftedForm.HiddenWidget name='tos' value={true} />

      </GiftedForm>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}
          >
         <View style={{marginTop: 22, height: 40, backgroundColor: '#ccc', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <View>
            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>
           </View>
           <Text>
            {this.state.modalTitle}
           </Text>
           <View>
            {this.state.modalRight}
           </View>
           </View>
          <View style={{flex: 1}}>
            {this.state.modalContent}
          </View>
          
        </Modal>
      </View>
    )
  }
}


AppRegistry.registerComponent('main', () => App);