<template>
<div>
  <table class="mail-table">
    <tbody>
      <tr v-for="email in unarchivedEmails"
          :key="email.id"
          :class="['clickable', email.read ? 'read' : '']"
          @click="openEmail(email)">
        <td><input type="checkbox"></td>
        <td>{{ email.from }}</td>
        <td>
          <p><strong>{{ email.subject }}</strong> - {{ email.body }}</p>
        </td>
        <td class="date">{{ format(new Date(email.sentAt), 'MMM do yyyy') }}</td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
    </table>

    <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
        <MailView :email="openedEmail" @changeEmail="changeEmail" />
    </ModalView>
</div>

</template>

<script>
import { format } from 'date-fns';
import axios from 'axios';
import MailView from '@/components/MailView.vue'
import ModalView from '@/components/ModalView.vue'

export default {
  name: 'MailTable',
  async setup () {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { data: emails } = await axios.get('http://localhost:3000/emails');

    return {
      format,
      emails,
      openedEmail: null,
    }
  },
  components: {
    MailView,
    ModalView,
  },
  computed: {
    sortedEmails () {
      const emails = [...this.emails];
      return emails.sort((e1, e2) => {
        return e1.sent < e2.sent ? 1 : -1
      });
    },

    unarchivedEmails () {
      return this.sortedEmails.filter((e) => !e.archived)
    }
  },
  methods: {
    openEmail(email) {
      this.openedEmail = email;
      if (email) {
        email.read = true;
        this.updateEmail(email);
      }
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    changeEmail({toggleRead, toggleArchive, save, closeModal, changeIndex}) {
      const email = this.openedEmail
      if (toggleRead) { email.read = !email.read }
      if (toggleArchive) { email.archived = !email.archived }
      if (save) { this.updateEmail(email) }
      if (closeModal) { this.openedEmail = null }
      if (changeIndex) {
        const emails = this.unarchivedEmails
        const currentIndex = emails.indexOf(this.openedEmail)
        const newEmail = emails[currentIndex + changeIndex]
        this.openEmail(newEmail)
      }
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    }
  }
};
</script>

<style scoped>

</style>
