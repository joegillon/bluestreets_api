from behave import *

use_step_matcher("re")


@given("I have registered with Bluestreets")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass


@step("I have defined my catchment area")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass


@given("I have no contact records\.")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass


@when("I request contacts with no since date")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass


@then("I should get back all contacts in my area")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass


@given("I have contact records")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass


@when("I request contact with a since date")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass


@then("I should get back all contact records update since date")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass