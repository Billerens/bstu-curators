import React from "react";
import { connect } from "react-redux";
import locale from "antd/es/date-picker/locale/ru_RU";
import { Form, Modal, Row, Col, Input, DatePicker } from "antd";
import EventService from "../../services/EventService";
import { closeEventsModal } from "../../redux/actions/eventModal";
import style from "./style.module.scss";
import debounce from "lodash/debounce";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.closingAfterSave = debounce(this.closingAfterSave, 100);
    this.state = {
      validStatus: false,
      form: {}
    };
  }

  save = () => {
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let event = {
        creator: this.props.profileId,
        title: values.title,
        subtitle: values.subtitle,
        place: values.place,
        dataStart: values.eventDate[0],
        dataEnd: values.eventDate[1],
        description: values.description
      };
      try {
        await EventService.addEvent(event);
      } catch (e) {
        console.log(e);
      }
      this.setState({ validStatus: true });
      this.closingAfterSave();
    });
  };

  closingAfterSave = () => {
    this.setState({ validStatus: false });
    this.props.closeEventsModal();
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, getFieldError },
      isOpen,
      closeEventsModal
    } = this.props;

    return (
      <Modal
        width={"70%"}
        title="Добавление события"
        centered
        className={style.modal}
        destroyOnClose={true}
        maskClosable={false}
        onCancel={() => closeEventsModal()}
        visible={isOpen}
        okText={"Сохранить"}
        cancelText={"Отмена"}
        onOk={this.save}
        zIndex={1030}
      >
        <Form>
          <Row type="flex" gutter={24}>
            <Col span={12}>
              <Form.Item label="Название события:">
                {getFieldDecorator("title", {
                  rules: [
                    {
                      required: true,
                      message: "Пожалуйста укажите название события"
                    }
                  ],
                  validateTrigger: "onBlur",
                  initialValue: this.state.form.title
                })(<Input placeholder="Событие" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Краткое описание события:">
                {getFieldDecorator("subtitle", {
                  rules: [
                    {
                      required: true,
                      message: "Пожалуйста укажите краткое описание события"
                    }
                  ],
                  validateTrigger: "onBlur",
                  initialValue: this.state.form.subtitle
                })(<Input placeholder="Описание" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Место проведения:">
                {getFieldDecorator("place", {
                  rules: [
                    {
                      required: true,
                      message: "Пожалуйста укажите место проведения"
                    }
                  ],
                  validateTrigger: "onBlur",
                  initialValue: this.state.form.place
                })(<Input placeholder="Место" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" gutter={24}>
            <Col span={12}>
              <Form.Item label="Дата проведения:">
                {getFieldDecorator("eventDate", {
                  rules: [
                    {
                      required: true,
                      message: "Пожалуйста укажите время проведения"
                    }
                  ],
                  initialValue: this.state.form.eventDate || 0
                })(<RangePicker locale={locale} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Полное описание события:">
                <Form.Item>
                  {getFieldDecorator("description", {
                    rules: [
                      {
                        pattern: /(^[^]{0,1000}$)/,
                        message: "Максимум 1000 символов!"
                      }
                    ],
                    initialValue: this.state.form.description
                  })(<TextArea autosize={{ minRows: 2, maxRows: 5 }} />)}
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const WrappedEventForm = Form.create({ name: "event" })(EventForm);

const mapStateToProps = state => ({
  profileId: state.users.profile.id,
  isOpen: state.eventModal.isOpen
});

const mapDispatchToProps = {
  closeEventsModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedEventForm);